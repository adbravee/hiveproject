export interface BlockchainStats {
  totalAccounts: number;
  totalPosts: number;
  activeAccounts: number;
  averageTransactions: number;
  timestamp?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeRange {
  label: string;
  value: number; // minutes
}