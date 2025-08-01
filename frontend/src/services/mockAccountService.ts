import { Account } from '../types/account';
import { AccountResponse } from '../api/accountService';

// Import the enhanced mock accounts from the transaction service
import { getMockAccounts as getMockAccountsFromTransactionService } from './mockTransactionService';

/**
 * Get mock accounts for demo purposes
 * Returns the AccountResponse interface expected by the dashboard
 */
export const getMockAccounts = async (): Promise<AccountResponse> => {
  try {
    // Simulate API delay for realistic demo experience
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const accounts = await getMockAccountsFromTransactionService();
    
    return {
      success: true,
      accounts: accounts,
      total: accounts.length
    };
  } catch (error) {
    console.error('Mock account service error:', error);
    return {
      success: false,
      accounts: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to load mock accounts'
    };
  }
}; 