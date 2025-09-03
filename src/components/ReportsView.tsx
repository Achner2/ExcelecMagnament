import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import type { Service } from './types';

interface ReportsViewProps {
  services: Service[];
}

type TimePeriod = '24h' | '7d' | '30d' | '90d';

export function ReportsView({ services }: ReportsViewProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d');

  // Generar datos mock para reportes
  const generatePerformanceData = () => {
    const days = timePeriod === '24h' ? 24 : timePeriod === '7d' ? 7 : timePeriod === '30d' ? 30 : 90;
    const interval = timePeriod === '24h' ? 'hour' : 'day';
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      if (timePeriod === '24h') {
        date.setHours(date.getHours() - (days - 1 - i));
      } else {
        date.setDate(date.getDate() - (days - 1 - i));
      }
      
      return {
        time: timePeriod === '24h' 
          ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        availability: 95 + Math.random() * 5,
        avgResponseTime: 150 + Math.random() * 100,
        throughput: 800 + Math.random() * 400,
        errors: Math.floor(Math.random() * 50),
      };
    });
  };

  const generateServiceComparison = () => {
    return services.map(service => ({
      name: service.name.replace(/\s.+/, ''), // Nombre corto
      availability: service.metrics.availability,
      responseTime: service.metrics.responseTime,
      throughput: service.metrics.transactionsPerMinute,
      status: service.status,
    }));
  };

  const generateStatusDistribution = () => {
    const online = services.filter(s => s.status === 'online').length;
    const warning = services.filter(s => s.status === 'warning').length;
    const error = services.filter(s => s.status === 'error').length;
    
    return [
      { name: 'En línea', value: online, color: '#22c55e' },
      { name: 'Advertencia', value: warning, color: '#fbbf24' },
      { name: 'Error', value: error, color: '#ef4444' },
    ].filter(item => item.value > 0);
  };

  const performanceData = generatePerformanceData();
  const serviceComparison = generateServiceComparison();
  const statusDistribution = generateStatusDistribution();

  // Calcular métricas consolidadas
  const totalUptime = services.reduce((acc, s) => acc + s.metrics.uptime, 0) / services.length;
  const totalThroughput = services.reduce((acc, s) => acc + s.metrics.transactionsPerMinute, 0);
  const avgResponseTime = services.reduce((acc, s) => acc + s.metrics.responseTime, 0) / services.length;
  const totalActiveAlerts = services.reduce((acc, s) => acc + s.alerts.filter(a => a.isActive).length, 0);

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case '24h': return 'Últimas 24 horas';
      case '7d': return 'Últimos 7 días';
      case '30d': return 'Últimos 30 días';
      case '90d': return 'Últimos 90 días';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Reportes y Analytics</h1>
            <p className="text-muted-foreground">
              Análisis detallado del rendimiento y tendencias del sistema
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
              <SelectTrigger className="w-64 h-12">
                <Calendar className="w-5 h-5 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-64">
                <SelectItem value="24h" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Últimas 24 horas</SelectItem>
                <SelectItem value="7d" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Últimos 7 días</SelectItem>
                <SelectItem value="30d" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Últimos 30 días</SelectItem>
                <SelectItem value="90d" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-12 px-6">
              <Download className="w-5 h-5 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Consolidadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime Promedio</p>
                <p className="text-2xl font-semibold text-green-600">{totalUptime.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+0.3% vs período anterior</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Throughput Total</p>
                <p className="text-2xl font-semibold text-blue-600">{(totalThroughput/1000).toFixed(1)}K/min</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">+12% vs período anterior</span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Latencia Promedio</p>
                <p className="text-2xl font-semibold text-yellow-600">{avgResponseTime.toFixed(0)}ms</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">-5% vs período anterior</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Activas</p>
                <p className="text-2xl font-semibold text-red-600">{totalActiveAlerts}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">-2 vs período anterior</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">{totalActiveAlerts}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tendencias de Rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencias de Rendimiento - {getPeriodLabel(timePeriod)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis yAxisId="left" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="availability" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Disponibilidad (%)" 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="avgResponseTime" 
                    stroke="#60a5fa" 
                    strokeWidth={2}
                    name="Tiempo Respuesta (ms)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribución de Estados */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Estados del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-between">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {statusDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.value} servicio{entry.value !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {Math.round((entry.value / services.length) * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparación de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Rendimiento por Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceComparison}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="availability" 
                  fill="#22c55e" 
                  name="Disponibilidad (%)" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="responseTime" 
                  fill="#60a5fa" 
                  name="Tiempo Respuesta (ms)" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Ejecutivo */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resumen Ejecutivo - {getPeriodLabel(timePeriod)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">✅ Aspectos Positivos</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Uptime general superior al 99%</li>
                  <li>• Reducción de latencia del 5% respecto al período anterior</li>
                  <li>• Incremento del throughput en un 12%</li>
                  <li>• {services.filter(s => s.status === 'online').length} de {services.length} servicios funcionando correctamente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-yellow-700">⚠️ Áreas de Mejora</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {totalActiveAlerts} alertas activas requieren atención</li>
                  <li>• Servicio Redis presenta degradación intermitente</li>
                  <li>• Picos de CPU en MySQL durante horas pico</li>
                  <li>• Revisar configuración de timeouts en Nginx</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Recomendación:</strong> Implementar auto-scaling en los servicios con alta carga y 
                configurar alertas predictivas para prevenir degradaciones futuras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}