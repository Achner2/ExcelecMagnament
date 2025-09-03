export type ServiceStatus = 'online' | 'warning' | 'error';

export interface ServiceMetrics {
  responseTime: number;
  transactionsPerMinute: number;
  cpu: number;
  memory: number;
  availability: number;
  uptime: number;
}

export interface TransactionData {
  timestamp: string;
  successful: number;
  failed: number;
}

export interface ResponseDistribution {
  http200: number;
  http4xx: number;
  http5xx: number;
  timeout: number;
}

export interface DetailedMetrics {
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  peakThroughput: number;
  lastError: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: string;
  status: 'success' | 'warning' | 'error';
  responseTime: number;
  userIp: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  isActive: boolean;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  status: ServiceStatus;
  ip: string;
  port: string;
  icon: string;
  metrics: ServiceMetrics;
  transactionHistory: TransactionData[];
  responseDistribution: ResponseDistribution;
  detailedMetrics: DetailedMetrics;
  recentTransactions: Transaction[];
  alerts: Alert[];
  dependencies: string[];
  sparklineData: number[];
}

export interface NetworkNode {
  id: string;
  name: string;
  type: string;
  status: ServiceStatus;
  x: number;
  y: number;
  dependencies: string[];
}