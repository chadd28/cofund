import { AIBudgetingService, SpendingAnalytics } from '../aiBudgetingService';
import { Transaction } from '../../types/transaction';

describe('AIBudgetingService', () => {
  const mockTransactions: Transaction[] = [
    // Income transactions
    {
      id: 'tx-income-1',
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
    // Expense transactions
    {
      id: 'tx-expense-1',
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
      id: 'tx-expense-2',
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
      id: 'tx-expense-3',
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
      id: 'tx-expense-4',
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
    }
  ];

  describe('analyzeSpending', () => {
    let analytics: SpendingAnalytics;

    beforeEach(() => {
      analytics = AIBudgetingService.analyzeSpending(mockTransactions);
    });

    it('should calculate correct financial metrics', () => {
      expect(analytics.totalIncome).toBe(2500.00);
      expect(analytics.totalSpending).toBe(304.94); // 45.67 + 12.50 + 89.99 + 156.78
      expect(analytics.netSavings).toBe(2195.06); // 2500 - 304.94
      expect(analytics.savingsRate).toBeCloseTo(87.8, 1); // (2195.06 / 2500) * 100
    });

    it('should categorize spending correctly', () => {
      expect(analytics.topCategories).toHaveLength(4);
      
      const groceries = analytics.topCategories.find(c => c.category === 'Groceries');
      expect(groceries).toBeDefined();
      expect(groceries?.total).toBe(45.67);
      expect(groceries?.transactionCount).toBe(1);
      
      const diningOut = analytics.topCategories.find(c => c.category === 'Dining Out');
      expect(diningOut).toBeDefined();
      expect(diningOut?.total).toBe(12.50);
      expect(diningOut?.transactionCount).toBe(1);
    });

    it('should generate insights', () => {
      expect(analytics.insights).toBeDefined();
      expect(Array.isArray(analytics.insights)).toBe(true);
      expect(analytics.insights.length).toBeGreaterThan(0);
      
      // Should have savings rate insight
      const savingsInsight = analytics.insights.find(i => i.type === 'savings_opportunity' || i.type === 'spending_pattern');
      expect(savingsInsight).toBeDefined();
    });

    it('should generate budget recommendations', () => {
      expect(analytics.recommendations).toBeDefined();
      expect(Array.isArray(analytics.recommendations)).toBe(true);
      
      // Should have recommendations for categories that exceed recommended budgets
      expect(analytics.recommendations.length).toBeGreaterThan(0);
    });

    it('should include monthly trend data', () => {
      expect(analytics.monthlyTrend).toBeDefined();
      expect(Array.isArray(analytics.monthlyTrend)).toBe(true);
      expect(analytics.monthlyTrend.length).toBeGreaterThan(0);
      
      const trend = analytics.monthlyTrend[0];
      expect(trend).toHaveProperty('month');
      expect(trend).toHaveProperty('spending');
      expect(trend).toHaveProperty('income');
    });
  });

  describe('category analysis', () => {
    it('should handle transactions with missing categories', () => {
      const transactionsWithMissingCategories: Transaction[] = [
        {
          id: 'tx-1',
          amount: -50.00,
          type: 'expense',
          description: 'Unknown purchase',
          date: '2025-07-30',
          posted_date: '2025-07-30',
          status: 'posted',
          is_verified: true,
          created_at: '2025-07-30T10:30:00Z'
        }
      ];

      const analytics = AIBudgetingService.analyzeSpending(transactionsWithMissingCategories);
      
      const uncategorized = analytics.topCategories.find(c => c.category === 'Uncategorized');
      expect(uncategorized).toBeDefined();
      expect(uncategorized?.total).toBe(50.00);
    });

    it('should prioritize user categories over teller categories', () => {
      const transactions: Transaction[] = [
        {
          id: 'tx-1',
          amount: -100.00,
          type: 'expense',
          description: 'Test purchase',
          date: '2025-07-30',
          posted_date: '2025-07-30',
          teller_category: 'Teller Category',
          user_category: 'User Category',
          status: 'posted',
          is_verified: true,
          created_at: '2025-07-30T10:30:00Z'
        }
      ];

      const analytics = AIBudgetingService.analyzeSpending(transactions);
      
      const userCategory = analytics.topCategories.find(c => c.category === 'User Category');
      expect(userCategory).toBeDefined();
      expect(userCategory?.total).toBe(100.00);
    });
  });

  describe('trend analysis', () => {
    it('should identify increasing trends', () => {
      const increasingTransactions: Transaction[] = [
        { id: 'tx-1', amount: -10, type: 'expense', description: 'Test', date: '2025-07-01', posted_date: '2025-07-01', status: 'posted', is_verified: true, created_at: '2025-07-01T00:00:00Z' },
        { id: 'tx-2', amount: -20, type: 'expense', description: 'Test', date: '2025-07-02', posted_date: '2025-07-02', status: 'posted', is_verified: true, created_at: '2025-07-02T00:00:00Z' },
        { id: 'tx-3', amount: -30, type: 'expense', description: 'Test', date: '2025-07-03', posted_date: '2025-07-03', status: 'posted', is_verified: true, created_at: '2025-07-03T00:00:00Z' },
        { id: 'tx-4', amount: -50, type: 'expense', description: 'Test', date: '2025-07-04', posted_date: '2025-07-04', status: 'posted', is_verified: true, created_at: '2025-07-04T00:00:00Z' },
        { id: 'tx-5', amount: -60, type: 'expense', description: 'Test', date: '2025-07-05', posted_date: '2025-07-05', status: 'posted', is_verified: true, created_at: '2025-07-05T00:00:00Z' },
        { id: 'tx-6', amount: -70, type: 'expense', description: 'Test', date: '2025-07-06', posted_date: '2025-07-06', status: 'posted', is_verified: true, created_at: '2025-07-06T00:00:00Z' }
      ];

      const analytics = AIBudgetingService.analyzeSpending(increasingTransactions);
      const category = analytics.topCategories.find(c => c.category === 'Uncategorized');
      expect(category?.trend).toBe('increasing');
    });

    it('should identify decreasing trends', () => {
      const decreasingTransactions: Transaction[] = [
        { id: 'tx-1', amount: -100, type: 'expense', description: 'Test', date: '2025-07-01', posted_date: '2025-07-01', status: 'posted', is_verified: true, created_at: '2025-07-01T00:00:00Z' },
        { id: 'tx-2', amount: -90, type: 'expense', description: 'Test', date: '2025-07-02', posted_date: '2025-07-02', status: 'posted', is_verified: true, created_at: '2025-07-02T00:00:00Z' },
        { id: 'tx-3', amount: -80, type: 'expense', description: 'Test', date: '2025-07-03', posted_date: '2025-07-03', status: 'posted', is_verified: true, created_at: '2025-07-03T00:00:00Z' },
        { id: 'tx-4', amount: -40, type: 'expense', description: 'Test', date: '2025-07-04', posted_date: '2025-07-04', status: 'posted', is_verified: true, created_at: '2025-07-04T00:00:00Z' },
        { id: 'tx-5', amount: -30, type: 'expense', description: 'Test', date: '2025-07-05', posted_date: '2025-07-05', status: 'posted', is_verified: true, created_at: '2025-07-05T00:00:00Z' },
        { id: 'tx-6', amount: -20, type: 'expense', description: 'Test', date: '2025-07-06', posted_date: '2025-07-06', status: 'posted', is_verified: true, created_at: '2025-07-06T00:00:00Z' }
      ];

      const analytics = AIBudgetingService.analyzeSpending(decreasingTransactions);
      const category = analytics.topCategories.find(c => c.category === 'Uncategorized');
      expect(category?.trend).toBe('decreasing');
    });
  });

  describe('insights generation', () => {
    it('should generate low savings rate insight for poor savings', () => {
      const lowSavingsTransactions: Transaction[] = [
        { id: 'tx-income', amount: 1000, type: 'income', description: 'Income', date: '2025-07-01', posted_date: '2025-07-01', status: 'posted', is_verified: true, created_at: '2025-07-01T00:00:00Z' },
        { id: 'tx-expense', amount: -950, type: 'expense', description: 'Expense', date: '2025-07-01', posted_date: '2025-07-01', status: 'posted', is_verified: true, created_at: '2025-07-01T00:00:00Z' }
      ];

      const analytics = AIBudgetingService.analyzeSpending(lowSavingsTransactions);
      const lowSavingsInsight = analytics.insights.find(i => i.type === 'savings_opportunity');
      expect(lowSavingsInsight).toBeDefined();
      expect(lowSavingsInsight?.severity).toBe('high');
    });

    it('should generate high savings rate insight for good savings', () => {
      const highSavingsTransactions: Transaction[] = [
        { id: 'tx-income', amount: 1000, type: 'income', description: 'Income', date: '2025-07-01', posted_date: '2025-07-01', status: 'posted', is_verified: true, created_at: '2025-07-01T00:00:00Z' },
        { id: 'tx-expense', amount: -200, type: 'expense', description: 'Expense', date: '2025-07-01', posted_date: '2025-07-01', status: 'posted', is_verified: true, created_at: '2025-07-01T00:00:00Z' }
      ];

      const analytics = AIBudgetingService.analyzeSpending(highSavingsTransactions);
      const highSavingsInsight = analytics.insights.find(i => i.type === 'spending_pattern');
      expect(highSavingsInsight).toBeDefined();
      expect(highSavingsInsight?.severity).toBe('low');
    });
  });
}); 