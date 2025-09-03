import type { Service } from './types';

const generateSparklineData = (trend: 'up' | 'down' | 'stable') => {
  const base = Math.random() * 100 + 50;
  return Array.from({ length: 30 }, (_, i) => {
    if (trend === 'up') return base + (i * 2) + (Math.random() * 10);
    if (trend === 'down') return base - (i * 1.5) + (Math.random() * 10);
    return base + (Math.random() * 20 - 10);
  });
};

const generateTransactionHistory = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    timestamp: new Date(Date.now() - (11 - i) * 2 * 60 * 60 * 1000).toISOString(),
    successful: Math.floor(Math.random() * 500 + 200),
    failed: Math.floor(Math.random() * 50 + 5),
  }));
};

const generateRecentTransactions = (serviceType: string) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `tx-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
    type: `${serviceType}_REQUEST`,
    status: Math.random() > 0.85 ? 'error' : Math.random() > 0.1 ? 'success' : 'warning' as const,
    responseTime: Math.floor(Math.random() * 500 + 50),
    userIp: `192.168.1.${Math.floor(Math.random() * 254 + 1)}`,
  }));
};

export const mockServices: Service[] = [
  {
    id: 'api-gateway',
    name: 'API Interno',
    type: 'Gateway',
    status: 'online',
    ip: '10.0.1.15',
    port: '443',
    icon: '🌐',
    metrics: {
      responseTime: 156,
      transactionsPerMinute: 1247,
      cpu: 45,
      memory: 62,
      availability: 99.97,
      uptime: 99.8,
    },
    transactionHistory: generateTransactionHistory(),
    responseDistribution: {
      http200: 1134,
      http4xx: 89,
      http5xx: 12,
      timeout: 3,
    },
    detailedMetrics: {
      avgLatency: 156,
      p95Latency: 320,
      p99Latency: 567,
      peakThroughput: 1850,
      lastError: 'Hace 1h 23m',
    },
    recentTransactions: generateRecentTransactions('GATEWAY'),
    alerts: [
      {
        id: 'alert-1',
        title: 'Latencia elevada detectada',
        severity: 'medium',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isActive: true,
        description: 'P95 superó los 400ms durante 5 minutos',
      },
    ],
    dependencies: ['api-pagos', 'mysql-db', 'redis-cache'],
    sparklineData: generateSparklineData('stable'),
  },
  {
    id: 'mysql-db',
    name: 'SQL Server',
    type: 'Database',
    status: 'online',
    ip: '10.0.2.10',
    port: '3306',
    icon: '🗄️',
    metrics: {
      responseTime: 23,
      transactionsPerMinute: 892,
      cpu: 78,
      memory: 84,
      availability: 99.99,
      uptime: 99.95,
    },
    transactionHistory: generateTransactionHistory(),
    responseDistribution: {
      http200: 845,
      http4xx: 28,
      http5xx: 15,
      timeout: 4,
    },
    detailedMetrics: {
      avgLatency: 23,
      p95Latency: 89,
      p99Latency: 156,
      peakThroughput: 1200,
      lastError: 'Hace 3h 45m',
    },
    recentTransactions: generateRecentTransactions('DATABASE'),
    alerts: [
      {
        id: 'alert-2',
        title: 'Uso de CPU elevado',
        severity: 'high',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isActive: true,
        description: 'CPU sostenido >75% durante 10 minutos',
      },
      {
        id: 'alert-3',
        title: 'Conexiones simultáneas altas',
        severity: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: false,
        description: 'Pool de conexiones al 90%',
      },
    ],
    dependencies: [],
    sparklineData: generateSparklineData('up'),
  },
  {
    id: 'nginx-web',
    name: 'EPM Portal Web',
    type: 'Web Server',
    status: 'warning',
    ip: '10.0.1.5',
    port: '80',
    icon: '🌍',
    metrics: {
      responseTime: 89,
      transactionsPerMinute: 2340,
      cpu: 67,
      memory: 56,
      availability: 98.5,
      uptime: 98.2,
    },
    transactionHistory: generateTransactionHistory(),
    responseDistribution: {
      http200: 2156,
      http4xx: 156,
      http5xx: 23,
      timeout: 5,
    },
    detailedMetrics: {
      avgLatency: 89,
      p95Latency: 234,
      p99Latency: 445,
      peakThroughput: 3200,
      lastError: 'Hace 12m',
    },
    recentTransactions: generateRecentTransactions('WEB'),
    alerts: [
      {
        id: 'alert-4',
        title: 'Disponibilidad reducida',
        severity: 'high',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        isActive: true,
        description: 'Múltiples timeouts en los últimos 30 minutos',
      },
    ],
    dependencies: ['api-gateway'],
    sparklineData: generateSparklineData('down'),
  },
  {
    id: 'api-pagos',
    name: 'API Portal',
    type: 'API Service',
    status: 'online',
    ip: '10.0.3.20',
    port: '8080',
    icon: '💳',
    metrics: {
      responseTime: 312,
      transactionsPerMinute: 456,
      cpu: 34,
      memory: 48,
      availability: 99.8,
      uptime: 99.6,
    },
    transactionHistory: generateTransactionHistory(),
    responseDistribution: {
      http200: 423,
      http4xx: 28,
      http5xx: 3,
      timeout: 2,
    },
    detailedMetrics: {
      avgLatency: 312,
      p95Latency: 567,
      p99Latency: 890,
      peakThroughput: 650,
      lastError: 'Hace 2h 15m',
    },
    recentTransactions: generateRecentTransactions('PAYMENT'),
    alerts: [],
    dependencies: ['mysql-db', 'redis-cache'],
    sparklineData: generateSparklineData('stable'),
  },
  {
    id: 'redis-cache',
    name: 'TokenergyGp',
    type: 'Token',
    status: 'error',
    ip: '10.0.2.25',
    port: '6379',
    icon: '🚀',
    metrics: {
      responseTime: 1234,
      transactionsPerMinute: 89,
      cpu: 15,
      memory: 92,
      availability: 87.3,
      uptime: 85.1,
    },
    transactionHistory: generateTransactionHistory(),
    responseDistribution: {
      http200: 67,
      http4xx: 12,
      http5xx: 8,
      timeout: 2,
    },
    detailedMetrics: {
      avgLatency: 1234,
      p95Latency: 2340,
      p99Latency: 4560,
      peakThroughput: 200,
      lastError: 'Hace 3m',
    },
    recentTransactions: generateRecentTransactions('CACHE'),
    alerts: [
      {
        id: 'alert-5',
        title: 'Servicio degradado',
        severity: 'high',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        isActive: true,
        description: 'Multiple fallos de conexión, posible problema de red',
      },
      {
        id: 'alert-6',
        title: 'Memoria crítica',
        severity: 'high',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        isActive: true,
        description: 'Uso de memoria >90%, posible memory leak',
      },
    ],
    dependencies: [],
    sparklineData: generateSparklineData('down'),
  },
];