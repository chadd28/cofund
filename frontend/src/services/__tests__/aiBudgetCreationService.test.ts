import { AIBudgetCreationService, BudgetCreationRequest } from '../aiBudgetCreationService';
import { Transaction } from '../../types/transaction';

describe('AIBudgetCreationService', () => {
  const mockTransactions: Transaction[] = [
    // Income transactions
    {
      id: 'tx-income-1',
      amount: 5000.00,
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
      amount: -1200.00,
      type: 'expense',
      description: 'Rent payment',
      date: '2025-07-30',
      posted_date: '2025-07-30',
      teller_category: 'Housing',
      teller_merchant: 'Landlord',
      user_category: 'Housing',
      user_merchant: 'Landlord',
      status: 'posted',
      is_verified: true,
      created_at: '2025-07-30T10:30:00Z'
    },
    {
      id: 'tx-expense-2',
      amount: -400.00,
      type: 'expense',
      description: 'Grocery shopping',
      date: '2025-07-29',
      posted_date: '2025-07-29',
      teller_category: 'Food & Drink',
      teller_merchant: 'Whole Foods Market',
      user_category: 'Groceries',
      user_merchant: 'Whole Foods',
      status: 'posted',
      is_verified: true,
      created_at: '2025-07-29T08:15:00Z'
    },
    {
      id: 'tx-expense-3',
      amount: -300.00,
      type: 'expense',
      description: 'Dining out',
      date: '2025-07-27',
      posted_date: '2025-07-27',
      teller_category: 'Food & Drink',
      teller_merchant: 'Various Restaurants',
      user_category: 'Dining Out',
      user_merchant: 'Various',
      status: 'posted',
      is_verified: true,
      created_at: '2025-07-27T00:00:00Z'
    },
    {
      id: 'tx-expense-4',
      amount: -200.00,
      type: 'expense',
      description: 'Gas and transportation',
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

  const mockRequest: BudgetCreationRequest = {
    monthlyIncome: 5000,
    financialGoals: ['Save for vacation', 'Buy a house'],
    riskTolerance: 'moderate',
    lifestyle: 'balanced',
    emergencyFund: 5000,
    debtPayments: 500
  };

  describe('generateBudgetSuggestions', () => {
    it('should generate budget suggestions', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    it('should include template information', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        expect(suggestion.template).toBeDefined();
        expect(suggestion.template.id).toBeDefined();
        expect(suggestion.template.name).toBeDefined();
        expect(suggestion.template.description).toBeDefined();
        expect(suggestion.template.categoryPercentages).toBeDefined();
        expect(suggestion.template.totalIncome).toBe(mockRequest.monthlyIncome);
        expect(suggestion.template.savingsRate).toBeGreaterThan(0);
        expect(suggestion.template.savingsRate).toBeLessThanOrEqual(1);
      });
    });

    it('should include budget categories', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        expect(suggestion.categories).toBeDefined();
        expect(Array.isArray(suggestion.categories)).toBe(true);
        expect(suggestion.categories.length).toBeGreaterThan(0);

        suggestion.categories.forEach(category => {
          expect(category.category).toBeDefined();
          expect(category.currentSpending).toBeGreaterThanOrEqual(0);
          expect(category.suggestedBudget).toBeGreaterThan(0);
          expect(category.percentage).toBeGreaterThan(0);
          expect(['high', 'medium', 'low']).toContain(category.priority);
          expect(category.reasoning).toBeDefined();
          expect(Array.isArray(category.tips)).toBe(true);
        });
      });
    });

    it('should include financial goals', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        expect(suggestion.goals).toBeDefined();
        expect(Array.isArray(suggestion.goals)).toBe(true);
        expect(suggestion.goals.length).toBeGreaterThan(0);

        suggestion.goals.forEach(goal => {
          expect(goal.id).toBeDefined();
          expect(goal.name).toBeDefined();
          expect(goal.targetAmount).toBeGreaterThan(0);
          expect(goal.currentAmount).toBeGreaterThanOrEqual(0);
          expect(goal.deadline).toBeDefined();
          expect(['high', 'medium', 'low']).toContain(goal.priority);
          expect(goal.category).toBeDefined();
        });
      });
    });

    it('should calculate confidence scores', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        expect(suggestion.confidence).toBeDefined();
        expect(suggestion.confidence).toBeGreaterThan(0);
        expect(suggestion.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should provide reasoning for suggestions', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        expect(suggestion.reasoning).toBeDefined();
        expect(typeof suggestion.reasoning).toBe('string');
        expect(suggestion.reasoning.length).toBeGreaterThan(0);
      });
    });

    it('should calculate total budget and estimated savings', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        expect(suggestion.totalBudget).toBeDefined();
        expect(suggestion.totalBudget).toBeGreaterThan(0);
        expect(suggestion.estimatedSavings).toBeDefined();
        expect(suggestion.estimatedSavings).toBeGreaterThanOrEqual(0);

        // Total budget + estimated savings should equal monthly income
        expect(suggestion.totalBudget + suggestion.estimatedSavings).toBeCloseTo(
          mockRequest.monthlyIncome,
          0
        );
      });
    });
  });

  describe('different risk tolerances', () => {
    it('should generate different suggestions for conservative risk tolerance', () => {
      const conservativeRequest = { ...mockRequest, riskTolerance: 'conservative' as const };
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        conservativeRequest
      );

      suggestions.forEach(suggestion => {
        // Conservative should have higher savings rate
        expect(suggestion.template.savingsRate).toBeGreaterThanOrEqual(0.15);
      });
    });

    it('should generate different suggestions for aggressive risk tolerance', () => {
      const aggressiveRequest = { ...mockRequest, riskTolerance: 'aggressive' as const };
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        aggressiveRequest
      );

      suggestions.forEach(suggestion => {
        // Aggressive should have very high savings rate
        expect(suggestion.template.savingsRate).toBeGreaterThanOrEqual(0.3);
      });
    });
  });

  describe('financial goals', () => {
    it('should generate goals based on user input', () => {
      const requestWithGoals = {
        ...mockRequest,
        financialGoals: ['Save for vacation', 'Buy a house', 'Pay off debt']
      };

      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        requestWithGoals
      );

      suggestions.forEach(suggestion => {
        // Should have at least emergency fund + user goals
        expect(suggestion.goals.length).toBeGreaterThanOrEqual(3);
        
        // Check for emergency fund goal
        const emergencyFundGoal = suggestion.goals.find(goal => goal.name === 'Emergency Fund');
        expect(emergencyFundGoal).toBeDefined();
        
        // Check for user goals
        const userGoals = suggestion.goals.filter(goal => 
          goal.name !== 'Emergency Fund' && goal.name !== 'Debt Payoff'
        );
        expect(userGoals.length).toBeGreaterThan(0);
      });
    });

    it('should estimate goal amounts based on goal type', () => {
      const requestWithSpecificGoals = {
        ...mockRequest,
        financialGoals: ['Save for vacation', 'Buy a house']
      };

      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        requestWithSpecificGoals
      );

      suggestions.forEach(suggestion => {
        const vacationGoal = suggestion.goals.find(goal => goal.name === 'Save for vacation');
        const houseGoal = suggestion.goals.find(goal => goal.name === 'Buy a house');

        if (vacationGoal) {
          // Vacation should be estimated as 2x monthly income
          expect(vacationGoal.targetAmount).toBeCloseTo(mockRequest.monthlyIncome * 2, -2);
        }

        if (houseGoal) {
          // House should be estimated as 20x monthly income
          expect(houseGoal.targetAmount).toBeCloseTo(mockRequest.monthlyIncome * 20, -3);
        }
      });
    });
  });

  describe('category analysis', () => {
    it('should analyze current spending patterns', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        // Should have categories that match current spending
        const housingCategory = suggestion.categories.find(cat => cat.category === 'Housing');
        const groceriesCategory = suggestion.categories.find(cat => cat.category === 'Groceries');
        const diningOutCategory = suggestion.categories.find(cat => cat.category === 'Dining Out');

        if (housingCategory) {
          expect(housingCategory.currentSpending).toBe(1200);
        }

        if (groceriesCategory) {
          expect(groceriesCategory.currentSpending).toBe(400);
        }

        if (diningOutCategory) {
          expect(diningOutCategory.currentSpending).toBe(300);
        }
      });
    });

    it('should provide category-specific tips', () => {
      const suggestions = AIBudgetCreationService.generateBudgetSuggestions(
        mockTransactions,
        mockRequest
      );

      suggestions.forEach(suggestion => {
        suggestion.categories.forEach(category => {
          expect(Array.isArray(category.tips)).toBe(true);
          
          // Categories with high spending should have tips
          if (category.currentSpending > category.suggestedBudget) {
            expect(category.tips.length).toBeGreaterThan(0);
          }
        });
      });
    });
  });
}); 