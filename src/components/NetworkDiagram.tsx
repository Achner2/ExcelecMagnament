import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Service } from './types';

interface NetworkDiagramProps {
  services: Service[];
  onNodeClick: (serviceId: string) => void;
  selectedService: string | null;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  name: string;
  status: string;
  icon: string;
  type: string;
  dependencies: string[];
}

export function NetworkDiagram({ services, onNodeClick, selectedService }: NetworkDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ 
          width: Math.max(800, rect.width),
          height: 500
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calcular posiciones de nodos en un layout de arquitectura
  const getNodePositions = (): NodePosition[] => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Posiciones predefinidas para crear un diagrama de arquitectura lógico
    const positions: Record<string, { x: number; y: number }> = {
      'nginx-web': { x: centerX, y: 80 },
      'api-gateway': { x: centerX, y: 180 },
      'api-pagos': { x: centerX - 150, y: 280 },
      'redis-cache': { x: centerX + 150, y: 280 },
      'mysql-db': { x: centerX, y: 380 },
    };

    return services.map(service => ({
      id: service.id,
      x: positions[service.id]?.x || centerX,
      y: positions[service.id]?.y || centerY,
      name: service.name,
      status: service.status,
      icon: service.icon,
      type: service.type,
      dependencies: service.dependencies,
    }));
  };

  const nodes = getNodePositions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'warning': return '#fbbf24';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'online': return 'from-green-400 to-green-600';
      case 'warning': return 'from-yellow-400 to-yellow-600';
      case 'error': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Generar líneas de conexión basadas en dependencias
  const connections = nodes.flatMap(node => 
    node.dependencies.map(depId => {
      const depNode = nodes.find(n => n.id === depId);
      if (!depNode) return null;
      return {
        from: node,
        to: depNode,
        id: `${node.id}-${depId}`,
      };
    }).filter(Boolean)
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border">
      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="min-w-full"
        >
          {/* Definir gradientes y filtros */}
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Líneas de conexión */}
          {connections.map((connection) => {
            if (!connection) return null;
            
            const isHighlighted = selectedService === connection.from.id || selectedService === connection.to.id;
            
            return (
              <g key={connection.id}>
                <motion.line
                  x1={connection.from.x}
                  y1={connection.from.y}
                  x2={connection.to.x}
                  y2={connection.to.y}
                  stroke={isHighlighted ? getStatusColor(connection.from.status) : "url(#connectionGradient)"}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeDasharray={isHighlighted ? "none" : "5,5"}
                  opacity={isHighlighted ? 1 : 0.6}
                  filter={isHighlighted ? "url(#glow)" : "none"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                
                {/* Flecha direccional */}
                <motion.polygon
                  points={`${connection.to.x - 8},${connection.to.y - 4} ${connection.to.x - 8},${connection.to.y + 4} ${connection.to.x - 2},${connection.to.y}`}
                  fill={isHighlighted ? getStatusColor(connection.from.status) : "#3b82f6"}
                  opacity={isHighlighted ? 1 : 0.6}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                />
              </g>
            );
          })}

          {/* Nodos de servicios */}
          {nodes.map((node) => {
            const isSelected = selectedService === node.id;
            const isConnected = selectedService && connections.some(conn => 
              (conn?.from.id === node.id && conn?.to.id === selectedService) ||
              (conn?.to.id === node.id && conn?.from.id === selectedService)
            );
            
            const shouldHighlight = isSelected || isConnected;

            return (
              <g key={node.id}>
                {/* Círculo de fondo del nodo */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={shouldHighlight ? 45 : 35}
                  fill={getStatusColor(node.status)}
                  filter={shouldHighlight ? "url(#glow)" : "url(#shadow)"}
                  className="cursor-pointer"
                  onClick={() => onNodeClick(node.id)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: Math.random() * 0.5, duration: 0.3 }}
                  whileHover={{ scale: shouldHighlight ? 1.1 : 1.15 }}
                  whileTap={{ scale: 0.95 }}
                />

                {/* Círculo interno */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={shouldHighlight ? 38 : 28}
                  fill="white"
                  className="cursor-pointer"
                  onClick={() => onNodeClick(node.id)}
                />

                {/* Ícono del servicio */}
                <foreignObject
                  x={node.x - 12}
                  y={node.y - 12}
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={() => onNodeClick(node.id)}
                >
                  <div className="text-xl text-center leading-6">
                    {node.icon}
                  </div>
                </foreignObject>

                {/* Indicador de estado pulsante */}
                {node.status !== 'online' && (
                  <motion.circle
                    cx={node.x + 25}
                    cy={node.y - 25}
                    r={6}
                    fill={getStatusColor(node.status)}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}

                {/* Etiqueta del servicio */}
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <rect
                    x={node.x - 60}
                    y={node.y + 50}
                    width={120}
                    height={32}
                    rx={6}
                    fill="white"
                    stroke={shouldHighlight ? getStatusColor(node.status) : "#e5e7eb"}
                    strokeWidth={shouldHighlight ? 2 : 1}
                    filter="url(#shadow)"
                  />
                  
                  <text
                    x={node.x}
                    y={node.y + 63}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-800"
                  >
                    {node.name.length > 14 ? node.name.substring(0, 12) + '...' : node.name}
                  </text>
                  
                  <text
                    x={node.x}
                    y={node.y + 76}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {node.type}
                  </text>
                </motion.g>

                {/* Métricas rápidas en hover */}
                {isSelected && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <rect
                      x={node.x + 50}
                      y={node.y - 30}
                      width={140}
                      height={60}
                      rx={8}
                      fill="white"
                      stroke={getStatusColor(node.status)}
                      strokeWidth={2}
                      filter="url(#shadow)"
                    />
                    <text x={node.x + 60} y={node.y - 15} className="text-xs font-medium fill-gray-800">
                      Métricas rápidas
                    </text>
                    <text x={node.x + 60} y={node.y - 2} className="text-xs fill-gray-600">
                      CPU: {services.find(s => s.id === node.id)?.metrics.cpu}%
                    </text>
                    <text x={node.x + 60} y={node.y + 12} className="text-xs fill-gray-600">
                      Latencia: {services.find(s => s.id === node.id)?.metrics.responseTime}ms
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>En línea</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Advertencia</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Error</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 opacity-60"></div>
          <span>Dependencias</span>
        </div>
      </div>
    </div>
  );
}