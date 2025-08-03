// Transaction types for the frontend

export interface Transaction {
  id: string;
  account_id?: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  date: string;
  posted_date?: string;
  teller_category?: string;
  teller_merchant?: string;
  user_category?: string;
  user_merchant?: string;
  status?: 'pending' | 'posted' | 'cancelled' | 'disputed';
  is_verified?: boolean;
  running_balance?: number;
  created_at: string;
  updated_at?: string;
}

export interface TransactionResponse {
  success: boolean;
  account: {
    id: string;
    name: string;
  };
  transactions: Transaction[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
} 