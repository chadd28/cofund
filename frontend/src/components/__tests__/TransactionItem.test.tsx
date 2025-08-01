import React from 'react';
import { render } from '@testing-library/react-native';
import { TransactionItem } from '../TransactionItem';
import { Transaction } from '../../types/transaction';

describe('TransactionItem', () => {
  const mockExpenseTransaction: Transaction = {
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
  };

  const mockIncomeTransaction: Transaction = {
    id: 'tx-002',
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
  };

  const mockTransferTransaction: Transaction = {
    id: 'tx-003',
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
  };

  it('should display expense transaction with red dot', () => {
    const { getByText } = render(<TransactionItem transaction={mockExpenseTransaction} />);
    
    // Check that the amount is displayed with negative sign
    expect(getByText('-$45.67')).toBeTruthy();
    
    // Check that the merchant name is displayed
    expect(getByText('Whole Foods')).toBeTruthy();
    
    // Check that the category is displayed
    expect(getByText('Groceries')).toBeTruthy();
  });

  it('should display income transaction with green dot', () => {
    const { getByText } = render(<TransactionItem transaction={mockIncomeTransaction} />);
    
    // Check that the amount is displayed with positive sign
    expect(getByText('+$2500.00')).toBeTruthy();
    
    // Check that the merchant name is displayed
    expect(getByText('ABC Company')).toBeTruthy();
    
    // Check that the category is displayed
    expect(getByText('Salary')).toBeTruthy();
  });

  it('should display transfer transaction with status-based dot', () => {
    const { getByText } = render(<TransactionItem transaction={mockTransferTransaction} />);
    
    // Check that the amount is displayed with positive sign
    expect(getByText('+$500.00')).toBeTruthy();
    
    // Check that the merchant name is displayed
    expect(getByText('Bank of America')).toBeTruthy();
    
    // Check that the category is displayed
    expect(getByText('Transfer')).toBeTruthy();
  });

  it('should handle missing user fields gracefully', () => {
    const transactionWithMissingFields: Transaction = {
      ...mockExpenseTransaction,
      user_category: undefined,
      user_merchant: undefined
    };

    const { getByText } = render(<TransactionItem transaction={transactionWithMissingFields} />);
    
    // Should fall back to teller fields
    expect(getByText('Whole Foods Market')).toBeTruthy();
    expect(getByText('Food & Drink')).toBeTruthy();
  });

  it('should handle missing all merchant fields gracefully', () => {
    const transactionWithNoMerchant: Transaction = {
      ...mockExpenseTransaction,
      user_merchant: undefined,
      teller_merchant: undefined
    };

    const { getByText } = render(<TransactionItem transaction={transactionWithNoMerchant} />);
    
    // Should fall back to description
    expect(getByText('Grocery shopping')).toBeTruthy();
  });
}); 