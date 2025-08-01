import React from 'react';
import { render } from '@testing-library/react-native';
import { SpendingPieChart } from '../SpendingPieChart';
import { SpendingCategory } from '../../services/aiBudgetingService';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: ({ children, ...props }: any) => React.createElement('Svg', props, children),
    Path: (props: any) => React.createElement('Path', props),
    G: ({ children, ...props }: any) => React.createElement('G', props, children),
    Text: (props: any) => React.createElement('Text', props),
  };
});

describe('SpendingPieChart', () => {
  const mockCategories: SpendingCategory[] = [
    {
      category: 'Groceries',
      total: 500,
      percentage: 40,
      transactionCount: 15,
      averageAmount: 33.33,
      trend: 'stable',
      recommendation: 'Consider meal planning to reduce grocery costs'
    },
    {
      category: 'Dining Out',
      total: 300,
      percentage: 24,
      transactionCount: 12,
      averageAmount: 25,
      trend: 'increasing',
      recommendation: 'Try cooking at home more often'
    },
    {
      category: 'Entertainment',
      total: 200,
      percentage: 16,
      transactionCount: 8,
      averageAmount: 25,
      trend: 'decreasing',
      recommendation: 'Good job reducing entertainment spending'
    },
    {
      category: 'Transportation',
      total: 150,
      percentage: 12,
      transactionCount: 6,
      averageAmount: 25,
      trend: 'stable',
      recommendation: 'Consider carpooling or public transport'
    },
    {
      category: 'Shopping',
      total: 100,
      percentage: 8,
      transactionCount: 4,
      averageAmount: 25,
      trend: 'stable',
      recommendation: 'Set a shopping budget'
    }
  ];

  it('renders correctly with categories', () => {
    const { getByText } = render(
      <SpendingPieChart 
        categories={mockCategories}
        totalSpending={1250}
      />
    );

    // Check if title is rendered
    expect(getByText('Spending by Category')).toBeTruthy();
    
    // Check if total spending is displayed
    expect(getByText('$1,250')).toBeTruthy();
    expect(getByText('Total Spent')).toBeTruthy();

    // Check if category names are rendered in legend
    expect(getByText('Groceries')).toBeTruthy();
    expect(getByText('Dining Out')).toBeTruthy();
    expect(getByText('Entertainment')).toBeTruthy();
    expect(getByText('Transportation')).toBeTruthy();
    expect(getByText('Shopping')).toBeTruthy();

    // Check if amounts are displayed in legend
    expect(getByText('$500')).toBeTruthy();
    expect(getByText('$300')).toBeTruthy();
    expect(getByText('$200')).toBeTruthy();
    expect(getByText('$150')).toBeTruthy();
    expect(getByText('$100')).toBeTruthy();
  });

  it('handles empty categories array', () => {
    const { getByText } = render(
      <SpendingPieChart 
        categories={[]}
        totalSpending={0}
      />
    );

    expect(getByText('Spending by Category')).toBeTruthy();
    expect(getByText('$0')).toBeTruthy();
  });

  it('formats large numbers correctly', () => {
    const largeCategories: SpendingCategory[] = [
      {
        category: 'Large Expense',
        total: 50000,
        percentage: 100,
        transactionCount: 1,
        averageAmount: 50000,
        trend: 'stable'
      }
    ];

    const { getByText } = render(
      <SpendingPieChart 
        categories={largeCategories}
        totalSpending={50000}
      />
    );

    expect(getByText('$50,000')).toBeTruthy();
  });
}); 