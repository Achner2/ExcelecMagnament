import { useState } from 'react';
import { Copy, TrendingUp, TrendingDown, AlertTriangle, Clock, Cpu, MemoryStick, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Sparkline } from './Sparkline';
import { TransactionChart } from './TransactionChart';
import { PieChart } from './PieChart';
import type { Service } from './types';
import { motion } from 'motion/react';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
  isFullWidth?: boolean;
}

export function ServiceCard({ service, isSelected, onSelect, isFullWidth = false }: ServiceCardProps) {
  const [copiedIp, setCopiedIp] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En línea';
      case 'warning': return 'Advertencia';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  const getTrendIcon = (current: number, threshold: number) => {
    if (current > threshold * 1.1) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < threshold * 0.9) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${service.ip}:${service.port}`);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeAlerts = service.alerts.filter(alert => alert.isActive);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${isFullWidth ? 'w-full' : ''}`}
    >
      <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-green-500 shadow-xl' : ''
      } ${isFullWidth ? 'w-full' : ''}`} onClick={onSelect}>
        <CardHeader className="pb-4">
          {/* SECCIÓN 1: Información Básica del Servicio */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{service.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.type}</p>
                {isFullWidth && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="mr-1">✨</span>
                    Vista expandida - Click para colapsar
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} animate-pulse`}></div>
              <Badge variant={service.status === 'online' ? 'default' : service.status === 'warning' ? 'secondary' : 'destructive'}>
                {getStatusText(service.status)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {service.ip}:{service.port}
              </code>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
              {copiedIp && <span className="text-xs text-green-600">Copiado!</span>}
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">Uptime:</span>
              <span className="font-medium text-green-600">{service.metrics.uptime.toFixed(1)}%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SECCIÓN 2: Métricas en Tiempo Real */}
          <div className={`grid gap-4 ${isFullWidth ? 'grid-cols-4 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4'}`}>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Tiempo Respuesta</span>
                {getTrendIcon(service.metrics.responseTime, 200)}
              </div>
              <div className="font-semibold">{service.metrics.responseTime}ms</div>
              <Sparkline data={service.sparklineData} height={24} className="mt-2" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Trans/min</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="font-semibold">{service.metrics.transactionsPerMinute.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">+12% vs ayer</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">CPU</span>
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-semibold">{service.metrics.cpu}%</div>
              <Progress value={service.metrics.cpu} className="mt-1 h-1" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Memoria</span>
                <MemoryStick className="w-4 h-4 text-purple-600" />
              </div>
              <div className="font-semibold">{service.metrics.memory}%</div>
              <Progress value={service.metrics.memory} className="mt-1 h-1" />
            </div>

            {/* Métricas adicionales solo en fullWidth */}
            {isFullWidth && (
              <>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Disponibilidad</span>
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="font-semibold">{service.metrics.availability.toFixed(1)}%</div>
                  <div className="text-xs text-green-600 mt-1">24h promedio</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Errores</span>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="font-semibold">{activeAlerts.length}</div>
                  <div className="text-xs text-red-600 mt-1">Activas ahora</div>
                </div>
              </>
            )}
          </div>

          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Layout para fullWidth con columnas lado a lado */}
              {isFullWidth ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Columna Izquierda */}
                  <div className="space-y-6">
                    {/* SECCIÓN 3: Gráfico de Transacciones */}
                    <div>
                      <h4 className="font-medium mb-3">Transacciones (24h)</h4>
                      <TransactionChart data={service.transactionHistory} />
                    </div>

                    {/* SECCIÓN 5: Métricas Detalladas */}
                    <div>
                      <h4 className="font-medium mb-3">Métricas Detalladas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Latencia promedio</span>
                            <span className="font-medium">{service.detailedMetrics.avgLatency}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">P95 latencia</span>
                            <span className="font-medium">{service.detailedMetrics.p95Latency}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">P99 latencia</span>
                            <span className="font-medium">{service.detailedMetrics.p99Latency}ms</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Throughput pico</span>
                            <span className="font-medium">{service.detailedMetrics.peakThroughput.toLocaleString()}/min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Último error</span>
                            <span className="font-medium text-red-600">{service.detailedMetrics.lastError}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Disponibilidad</span>
                            <span className="font-medium text-green-600">{service.metrics.availability.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Columna Derecha */}
                  <div className="space-y-6">
                    {/* SECCIÓN 4: Gráfico de Torta */}
                    <div>
                      <h4 className="font-medium mb-3">Distribución de Respuestas</h4>
                      <PieChart data={service.responseDistribution} />
                    </div>

                    {/* SECCIÓN 7: Alertas Específicas */}
                    {service.alerts.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Alertas</h4>
                        <div className="space-y-2">
                          {activeAlerts.map((alert) => (
                            <Alert key={alert.id} className={
                              alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                              alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                              'border-blue-200 bg-blue-50'
                            }>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium">{alert.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(alert.timestamp)}
                                  </div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                          
                          {service.alerts.filter(alert => !alert.isActive).length > 0 && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                Ver historial ({service.alerts.filter(alert => !alert.isActive).length} alertas resueltas)
                              </summary>
                              <div className="mt-2 space-y-1">
                                {service.alerts.filter(alert => !alert.isActive).map((alert) => (
                                  <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{alert.title}</span>
                                    <span className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Layout original para tarjetas normales
                <>
                  {/* SECCIÓN 3: Gráfico de Transacciones */}
                  <div>
                    <h4 className="font-medium mb-3">Transacciones (24h)</h4>
                    <TransactionChart data={service.transactionHistory} />
                  </div>

                  {/* SECCIÓN 4: Gráfico de Torta */}
                  <div>
                    <h4 className="font-medium mb-3">Distribución de Respuestas</h4>
                    <PieChart data={service.responseDistribution} />
                  </div>

                  {/* SECCIÓN 5: Métricas Detalladas */}
                  <div>
                    <h4 className="font-medium mb-3">Métricas Detalladas</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Latencia promedio</span>
                          <span className="font-medium">{service.detailedMetrics.avgLatency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">P95 latencia</span>
                          <span className="font-medium">{service.detailedMetrics.p95Latency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">P99 latencia</span>
                          <span className="font-medium">{service.detailedMetrics.p99Latency}ms</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Throughput pico</span>
                          <span className="font-medium">{service.detailedMetrics.peakThroughput.toLocaleString()}/min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Último error</span>
                          <span className="font-medium text-red-600">{service.detailedMetrics.lastError}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Disponibilidad</span>
                          <span className="font-medium text-green-600">{service.metrics.availability.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN 7: Alertas Específicas */}
                  {service.alerts.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Alertas</h4>
                      <div className="space-y-2">
                        {activeAlerts.map((alert) => (
                          <Alert key={alert.id} className={
                            alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                            alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                            'border-blue-200 bg-blue-50'
                          }>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium">{alert.title}</div>
                                  <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                                </div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDate(alert.timestamp)}
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                        
                        {service.alerts.filter(alert => !alert.isActive).length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Ver historial ({service.alerts.filter(alert => !alert.isActive).length} alertas resueltas)
                            </summary>
                            <div className="mt-2 space-y-1">
                              {service.alerts.filter(alert => !alert.isActive).map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{alert.title}</span>
                                  <span className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</span>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SECCIÓN 6: Historial de Transacciones - Siempre a ancho completo */}
              <div className={isFullWidth ? 'col-span-full' : ''}>
                <h4 className="font-medium mb-3">Historial de Transacciones</h4>
                <div className={`overflow-y-auto ${isFullWidth ? 'max-h-64' : 'max-h-48'}`}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Tiempo</TableHead>
                        <TableHead>Usuario/IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-xs">{formatTime(transaction.timestamp)}</TableCell>
                          <TableCell className="text-xs">{transaction.type}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.status === 'success' ? 'default' : 
                                     transaction.status === 'warning' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{transaction.responseTime}ms</TableCell>
                          <TableCell className="text-xs">{transaction.userIp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}