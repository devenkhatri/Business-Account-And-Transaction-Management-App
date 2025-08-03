export interface Location {
  id: number;
  name: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: number;
  name: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  transactionNo: string;
  date: Date;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description?: string;
  accountId: number;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
  location?: Location;
}

export interface DashboardMetrics {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  transactionCount: number;
}

export interface ChartData {
  date: string;
  amount: number;
}

export interface AccountSummary {
  accountId: number;
  accountName: string;
  total: number;
}