import { Transaction, TransactionResponse } from '../types/transaction';
import { Account } from '../types/account';

// Mock demo accounts with enhanced UI fields - Updated to match Bank of America accounts from screenshot
const mockAccounts: Account[] = [
  {
    id: 'demo-checking-001',
    name: 'My Checking',
    type: 'checking',
    balance: 83367.00,
    mask: '***8636',
    gradientColors: ['#4A90E2', '#357ABD'] as const,
    currency: 'USD',
    institution: 'Bank of America',
    available_balance: 83367.00,
    sync_status: 'synced',
    is_active: true,
    last_sync: '2025-07-31T00:00:00Z',
    created_at: '2025-05-15T00:00:00Z'
  },
  {
    id: 'demo-savings-001',
    name: 'Essential Savings',
    type: 'savings',
    balance: 29921.00,
    mask: '***7101',
    gradientColors: ['#50C878', '#32CD32'] as const,
    currency: 'USD',
    institution: 'Bank of America',
    available_balance: 29921.00,
    sync_status: 'synced',
    is_active: true,
    last_sync: '2025-07-31T00:00:00Z',
    created_at: '2025-05-15T00:00:00Z'
  },
  {
    id: 'demo-credit-001',
    name: 'Platinum Card',
    type: 'credit',
    balance: -5000.00,
    mask: '***3918',
    gradientColors: ['#FF6B6B', '#FF5252'] as const,
    currency: 'USD',
    institution: 'Bank of America',
    available_balance: 5000.00, // Credit limit - balance
    sync_status: 'synced',
    is_active: true,
    last_sync: '2025-07-31T00:00:00Z',
    created_at: '2025-05-15T00:00:00Z'
  }
];

// Mock transaction data - last 3 months of realistic transactions (as of July 31, 2025)
const mockTransactions: Transaction[] = [
  // Recent transactions (last week)
  {
    id: 'tx-001',
    amount: -45.67,
    type: 'expense',
    description: 'Grocery shopping',
    date: '2025-07-30',
    posted_date: '2025-07-30',
    teller_category: 'Food & Drink',
    teller_merchant: 'Whole Foods Market',
    user_category: 'Groceries',
    user_merchant: 'Whole Foods',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-30T10:30:00Z'
  },
  {
    id: 'tx-002',
    amount: -12.50,
    type: 'expense',
    description: 'Coffee and breakfast',
    date: '2025-07-29',
    posted_date: '2025-07-29',
    teller_category: 'Food & Drink',
    teller_merchant: 'Starbucks',
    user_category: 'Dining Out',
    user_merchant: 'Starbucks',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-29T08:15:00Z'
  },
  {
    id: 'tx-003',
    amount: 2500.00,
    type: 'income',
    description: 'Salary deposit',
    date: '2025-07-28',
    posted_date: '2025-07-28',
    teller_category: 'Income',
    teller_merchant: 'ABC Company',
    user_category: 'Salary',
    user_merchant: 'ABC Company',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-28T09:00:00Z'
  },
  {
    id: 'tx-004',
    amount: -89.99,
    type: 'expense',
    description: 'Monthly subscription',
    date: '2025-07-27',
    posted_date: '2025-07-27',
    teller_category: 'Shopping',
    teller_merchant: 'Netflix',
    user_category: 'Entertainment',
    user_merchant: 'Netflix',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-27T00:00:00Z'
  },
  {
    id: 'tx-005',
    amount: -156.78,
    type: 'expense',
    description: 'Gas station',
    date: '2025-07-26',
    posted_date: '2025-07-26',
    teller_category: 'Transportation',
    teller_merchant: 'Shell',
    user_category: 'Transportation',
    user_merchant: 'Shell Gas',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-26T14:20:00Z'
  },
  // More transactions from previous weeks
  {
    id: 'tx-006',
    amount: -67.89,
    type: 'expense',
    description: 'Restaurant dinner',
    date: '2025-07-25',
    posted_date: '2025-07-25',
    teller_category: 'Food & Drink',
    teller_merchant: 'Chipotle',
    user_category: 'Dining Out',
    user_merchant: 'Chipotle',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-25T19:30:00Z'
  },
  {
    id: 'tx-007',
    amount: -23.45,
    type: 'expense',
    description: 'Pharmacy purchase',
    date: '2025-07-24',
    posted_date: '2025-07-24',
    teller_category: 'Health & Fitness',
    teller_merchant: 'CVS Pharmacy',
    user_category: 'Healthcare',
    user_merchant: 'CVS',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-24T16:45:00Z'
  },
  {
    id: 'tx-008',
    amount: -234.56,
    type: 'expense',
    description: 'Online shopping',
    date: '2025-07-23',
    posted_date: '2025-07-23',
    teller_category: 'Shopping',
    teller_merchant: 'Amazon',
    user_category: 'Shopping',
    user_merchant: 'Amazon',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-23T11:20:00Z'
  },
  {
    id: 'tx-009',
    amount: -15.99,
    type: 'expense',
    description: 'Music subscription',
    date: '2025-07-22',
    posted_date: '2025-07-22',
    teller_category: 'Entertainment',
    teller_merchant: 'Spotify',
    user_category: 'Entertainment',
    user_merchant: 'Spotify',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-22T00:00:00Z'
  },
  {
    id: 'tx-010',
    amount: 500.00,
    type: 'transfer',
    description: 'Transfer from savings',
    date: '2025-07-21',
    posted_date: '2025-07-21',
    teller_category: 'Transfer',
    teller_merchant: 'Internal Transfer',
    user_category: 'Transfer',
    user_merchant: 'Bank of America',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-21T10:00:00Z'
  },
  // Older transactions (last month)
  {
    id: 'tx-011',
    amount: -89.99,
    type: 'expense',
    description: 'Gym membership',
    date: '2025-07-20',
    posted_date: '2025-07-20',
    teller_category: 'Health & Fitness',
    teller_merchant: 'Planet Fitness',
    user_category: 'Health & Fitness',
    user_merchant: 'Planet Fitness',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-20T00:00:00Z'
  },
  {
    id: 'tx-012',
    amount: -45.00,
    type: 'expense',
    description: 'Haircut and styling',
    date: '2025-07-19',
    posted_date: '2025-07-19',
    teller_category: 'Personal Care',
    teller_merchant: 'Great Clips',
    user_category: 'Personal Care',
    user_merchant: 'Great Clips',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-19T15:30:00Z'
  },
  {
    id: 'tx-013',
    amount: -123.45,
    type: 'expense',
    description: 'Electric bill',
    date: '2025-07-18',
    posted_date: '2025-07-18',
    teller_category: 'Bills & Utilities',
    teller_merchant: 'Pacific Gas & Electric',
    user_category: 'Utilities',
    user_merchant: 'PG&E',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-18T00:00:00Z'
  },
  {
    id: 'tx-014',
    amount: -67.89,
    type: 'expense',
    description: 'Target shopping',
    date: '2025-07-17',
    posted_date: '2025-07-17',
    teller_category: 'Shopping',
    teller_merchant: 'Target',
    user_category: 'Shopping',
    user_merchant: 'Target',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-17T14:15:00Z'
  },
  {
    id: 'tx-015',
    amount: 2500.00,
    type: 'income',
    description: 'Salary deposit',
    date: '2025-07-14',
    posted_date: '2025-07-14',
    teller_category: 'Income',
    teller_merchant: 'ABC Company',
    user_category: 'Salary',
    user_merchant: 'ABC Company',
    status: 'posted',
    is_verified: true,
    created_at: '2025-07-14T09:00:00Z'
  }
];

/**
 * Get mock transactions for demo purposes
 * Simulates the same interface as the real API
 */
export const getMockTransactions = async (
  accountId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<TransactionResponse> => {
  // Simulate API delay for realistic demo experience
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the account
  const account = mockAccounts.find(acc => acc.id === accountId);
  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }

  let filteredTransactions = [...mockTransactions];

  // Apply date filters if provided
  if (options?.startDate) {
    filteredTransactions = filteredTransactions.filter(
      tx => tx.date >= options.startDate!
    );
  }
  if (options?.endDate) {
    filteredTransactions = filteredTransactions.filter(
      tx => tx.date <= options.endDate!
    );
  }

  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

  return {
    success: true,
    account: {
      id: account.id,
      name: account.name
    },
    transactions: paginatedTransactions,
    pagination: {
      limit,
      offset,
      total: filteredTransactions.length
    }
  };
};

/**
 * Get mock accounts for demo purposes
 */
export const getMockAccounts = async (): Promise<Account[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAccounts;
}; 