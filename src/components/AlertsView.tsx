import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Filter, Search, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';
import type { Service, Alert as AlertType } from './types';

interface AlertsViewProps {
  services: Service[];
}

type AlertFilter = 'all' | 'active' | 'resolved' | 'high' | 'medium' | 'low';

export function AlertsView({ services }: AlertsViewProps) {
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Agregar datos de alertas desde todos los servicios
  const allAlerts = services.flatMap(service => 
    service.alerts.map(alert => ({
      ...alert,
      serviceName: service.name,
      serviceId: service.id,
      serviceIcon: service.icon,
      serviceStatus: service.status,
    }))
  );

  // Filtrar alertas basado en los criterios
  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && alert.isActive) ||
                         (filter === 'resolved' && !alert.isActive) ||
                         alert.severity === filter;

    return matchesSearch && matchesFilter;
  });

  const activeAlertsCount = allAlerts.filter(alert => alert.isActive).length;
  const resolvedAlertsCount = allAlerts.filter(alert => !alert.isActive).length;
  const highPriorityCount = allAlerts.filter(alert => alert.isActive && alert.severity === 'high').length;

  const getSeverityColor = (severity: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-600';
    
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string, isActive: boolean) => {
    if (!isActive) return <CheckCircle className="w-4 h-4" />;
    
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else {
      return alertTime.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
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
        <h1 className="mb-2">Centro de Alertas</h1>
        <p className="text-muted-foreground">
          Gestión centralizada de notificaciones y eventos del sistema
        </p>
      </div>

      {/* Métricas de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Alertas Activas</p>
                <p className="text-2xl font-semibold text-red-700">{activeAlertsCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Resueltas (24h)</p>
                <p className="text-2xl font-semibold text-green-700">{resolvedAlertsCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Críticas</p>
                <p className="text-2xl font-semibold text-orange-700">{highPriorityCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Filtrado */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar alertas por título o servicio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filter} onValueChange={(value) => setFilter(value as AlertFilter)}>
                <SelectTrigger className="w-64 h-12">
                  <Filter className="w-5 h-5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-64">
                  <SelectItem value="all" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Todas las alertas</SelectItem>
                  <SelectItem value="active" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Solo activas</SelectItem>
                  <SelectItem value="resolved" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Solo resueltas</SelectItem>
                  <SelectItem value="high" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Alta prioridad</SelectItem>
                  <SelectItem value="medium" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Media prioridad</SelectItem>
                  <SelectItem value="low" className="py-3 px-4 text-base cursor-pointer hover:bg-green-50">Baja prioridad</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="h-12 px-6">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">No se encontraron alertas</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Intenta modificar tu búsqueda' : 'No hay alertas que coincidan con los filtros seleccionados'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Alert className={`${
                alert.isActive 
                  ? alert.severity === 'high' 
                    ? 'border-red-200 bg-red-50' 
                    : alert.severity === 'medium' 
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              } transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getSeverityIcon(alert.severity, alert.isActive)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <AlertDescription>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{alert.serviceIcon}</span>
                            <div>
                              <h4 className="font-semibold text-foreground">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground">{alert.serviceName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(alert.severity, alert.isActive)}>
                              {alert.severity === 'high' ? 'Alta' : 
                               alert.severity === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                            {!alert.isActive && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Resuelta
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {alert.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(alert.timestamp)}
                          </span>
                          
                          {alert.isActive && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Investigar
                              </Button>
                              <Button size="sm" variant="default">
                                Resolver
                              </Button>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </div>
              </Alert>
            </motion.div>
          ))
        )}
      </div>
      
      {filteredAlerts.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="px-8">
            Cargar más alertas
          </Button>
        </div>
      )}
    </motion.div>
  );
}