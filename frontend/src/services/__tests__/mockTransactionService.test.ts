import { getMockTransactions, getMockAccounts } from '../mockTransactionService';
import { Transaction, TransactionResponse } from '../../types/transaction';
import { Account } from '../../types/account';

describe('MockTransactionService', () => {
  describe('getMockAccounts', () => {
    it('should return mock accounts', async () => {
      const accounts = await getMockAccounts();
      
      expect(accounts).toBeDefined();
      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBeGreaterThan(0);
      
      // Check first account structure
      const firstAccount = accounts[0];
      expect(firstAccount).toHaveProperty('id');
      expect(firstAccount).toHaveProperty('name');
      expect(firstAccount).toHaveProperty('type');
      expect(firstAccount).toHaveProperty('balance');
    });
  });

  describe('getMockTransactions', () => {
    it('should return transactions for valid account', async () => {
      const response = await getMockTransactions('demo-checking-001');
      
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.account).toBeDefined();
      expect(response.transactions).toBeDefined();
      expect(Array.isArray(response.transactions)).toBe(true);
      expect(response.transactions.length).toBeGreaterThan(0);
      expect(response.pagination).toBeDefined();
    });

    it('should throw error for invalid account', async () => {
      await expect(getMockTransactions('invalid-account-id'))
        .rejects
        .toThrow('Account invalid-account-id not found');
    });

    it('should support pagination', async () => {
      const response = await getMockTransactions('demo-checking-001', { limit: 5, offset: 0 });
      
      expect(response.transactions.length).toBeLessThanOrEqual(5);
      expect(response.pagination.limit).toBe(5);
      expect(response.pagination.offset).toBe(0);
    });

    it('should support date filtering', async () => {
      const response = await getMockTransactions('demo-checking-001', { 
        startDate: '2025-07-25',
        endDate: '2025-07-30'
      });
      
      // All transactions should be within the date range
      response.transactions.forEach(transaction => {
        expect(transaction.date >= '2025-07-25').toBe(true);
        expect(transaction.date <= '2025-07-30').toBe(true);
      });
    });

    it('should return transactions with correct structure', async () => {
      const response = await getMockTransactions('demo-checking-001');
      const transaction = response.transactions[0];
      
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('description');
      expect(transaction).toHaveProperty('date');
      expect(transaction).toHaveProperty('posted_date');
      expect(transaction).toHaveProperty('status');
      expect(transaction).toHaveProperty('is_verified');
      expect(transaction).toHaveProperty('created_at');
    });
  });
}); 