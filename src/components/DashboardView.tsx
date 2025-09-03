import { ServiceCard } from './ServiceCard';
import { NetworkDiagram } from './NetworkDiagram';
import type { Service } from './types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  services: Service[];
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
  showNetworkDiagram: boolean;
}

export function DashboardView({ 
  services, 
  selectedService, 
  onServiceSelect, 
  showNetworkDiagram 
}: DashboardViewProps) {
  const getTitle = () => {
    if (showNetworkDiagram) {
      return {
        title: "Dashboard de Monitoreo",
        subtitle: "Estado en tiempo real de todos los servicios críticos"
      };
    } else {
      return {
        title: "Servicios del Sistema",
        subtitle: "Gestión y monitoreo detallado de cada servicio"
      };
    }
  };

  const { title, subtitle } = getTitle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="mb-8">
        <h1 className="mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {/* Métricas Generales (solo en Dashboard) */}
      {showNetworkDiagram && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Servicios Activos</p>
                <p className="text-2xl font-semibold text-green-700">
                  {services.filter(s => s.status === 'online').length}/{services.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Latencia Promedio</p>
                <p className="text-2xl font-semibold text-blue-700">
                  {Math.round(services.reduce((acc, s) => acc + s.metrics.responseTime, 0) / services.length)}ms
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                ⚡
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Alertas Activas</p>
                <p className="text-2xl font-semibold text-yellow-700">
                  {services.reduce((acc, s) => acc + s.alerts.filter(a => a.isActive).length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                ⚠️
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Throughput Total</p>
                <p className="text-2xl font-semibold text-purple-700">
                  {(services.reduce((acc, s) => acc + s.metrics.transactionsPerMinute, 0) / 1000).toFixed(1)}K/min
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                📊
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Service Full Width (si hay un servicio seleccionado) */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 200 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-1 rounded-xl">
            <ServiceCard 
              service={services.find(s => s.id === selectedService)!}
              isSelected={true}
              onSelect={() => onServiceSelect(selectedService)}
              isFullWidth={true}
            />
          </div>
        </motion.div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {services
          .filter(service => selectedService !== service.id) // Filtrar el servicio seleccionado
          .map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ServiceCard 
              service={service}
              isSelected={false}
              onSelect={() => onServiceSelect(service.id)}
              isFullWidth={false}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Network Architecture Diagram (solo en Dashboard) */}
      {showNetworkDiagram && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-12"
        >
          <div className="mb-6">
            <h2 className="mb-2">Arquitectura del Sistema</h2>
            <p className="text-muted-foreground">
              Vista general de las dependencias e interacciones entre servicios
            </p>
          </div>
          <NetworkDiagram 
            services={services} 
            onNodeClick={onServiceSelect}
            selectedService={selectedService}
          />
        </motion.div>
      )}
    </motion.div>
  );
}