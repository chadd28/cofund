import { Transaction } from '../types/transaction';

export interface SpendingCategory {
  category: string;
  total: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation?: string;
  budget?: number; // Monthly budget for this category
  remaining?: number; // Remaining budget
  budgetPercentage?: number; // Percentage of budget used
}

export interface BudgetInsight {
  type: 'spending_pattern' | 'category_alert' | 'budget_recommendation' | 'savings_opportunity';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category?: string;
  amount?: number;
  percentage?: number;
}

export interface BudgetRecommendation {
  category: string;
  currentSpending: number;
  recommendedBudget: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SpendingAnalytics {
  totalSpending: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number;
  topCategories: SpendingCategory[];
  insights: BudgetInsight[];
  recommendations: BudgetRecommendation[];
  monthlyTrend: {
    month: string;
    spending: number;
    income: number;
  }[];
}

/**
 * AI Budgeting Service - Provides intelligent spending analysis and recommendations
 */
export class AIBudgetingService {
  /**
   * Analyze spending patterns and generate insights
   */
  static analyzeSpending(transactions: Transaction[]): SpendingAnalytics {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const income = transactions.filter(tx => tx.type === 'income');
    
    const totalSpending = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);
    const netSavings = totalIncome - totalSpending;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    
    // Categorize spending
    const categoryMap = new Map<string, { total: number; count: number; amounts: number[] }>();
    
    expenses.forEach(transaction => {
      const category = transaction.user_category || transaction.teller_category || 'Uncategorized';
      const amount = Math.abs(transaction.amount);
      
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.total += amount;
        existing.count += 1;
        existing.amounts.push(amount);
      } else {
        categoryMap.set(category, { total: amount, count: 1, amounts: [amount] });
      }
    });
    
    // Generate top categories with budget information
    const allCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => {
        const budget = this.calculateRecommendedBudget(category, data.total, totalIncome);
        const remaining = Math.max(0, budget - data.total);
        const budgetPercentage = budget > 0 ? (data.total / budget) * 100 : 0;
        
        return {
          category,
          total: data.total,
          percentage: (data.total / totalSpending) * 100,
          transactionCount: data.count,
          averageAmount: data.total / data.count,
          trend: this.analyzeTrend(data.amounts, budget),
          recommendation: this.generateCategoryRecommendation(category, data.total, data.count, budget, remaining),
          budget,
          remaining,
          budgetPercentage
        };
      })
      .sort((a, b) => b.total - a.total);
    
    const topCategories: SpendingCategory[] = allCategories.slice(0, 12); // Show more categories for better overview
    
    // Generate insights
    const insights = this.generateInsights(expenses, totalSpending, totalIncome, savingsRate, topCategories);
    
    // Generate budget recommendations
    const recommendations = this.generateBudgetRecommendations(topCategories, totalIncome);
    
    // Generate monthly trend (mock data for demo)
    const monthlyTrend = this.generateMonthlyTrend();
    
    return {
      totalSpending,
      totalIncome,
      netSavings,
      savingsRate,
      topCategories,
      insights,
      recommendations,
      monthlyTrend
    };
  }
  
  /**
   * Analyze budget usage trend for a category based on current budget status
   */
  private static analyzeTrend(amounts: number[], budget: number): 'increasing' | 'decreasing' | 'stable' {
    if (amounts.length < 3) return 'stable';
    
    // Calculate total spending and budget percentage
    const totalSpending = amounts.reduce((a, b) => a + b, 0);
    const budgetPercentage = (totalSpending / budget) * 100;
    
    // Determine trend based on current budget usage
    if (budgetPercentage >= 100) {
      // Over budget - this is "increasing" (using budget aggressively)
      return 'increasing';
    } else if (budgetPercentage >= 80) {
      // Near budget limit - this is "increasing" (approaching limit)
      return 'increasing';
    } else if (budgetPercentage <= 30) {
      // Well under budget - this is "decreasing" (using budget conservatively)
      return 'decreasing';
    } else {
      // Moderate usage - this is "stable"
      return 'stable';
    }
  }
  
  /**
   * Generate category-specific recommendations
   */
  private static generateCategoryRecommendation(category: string, total: number, count: number, budget?: number, remaining?: number): string {
    const average = total / count;
    const isOverBudget = budget && remaining && remaining < 0;
    const budgetPercentage = budget ? (total / budget) * 100 : 0;
    
    switch (category.toLowerCase()) {
      case 'food & dining':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your food budget. Try meal prepping to reduce costs.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your food budget. Consider reducing dining out.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of food budget used.`;
        }
        
      case 'transportation':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your transport budget. Consider carpooling or public transit.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your transport budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of transport budget used.`;
        }
      
      case 'shopping':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your shopping budget. Set monthly limits.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your shopping budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of shopping budget used.`;
        }
      
      case 'entertainment':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your entertainment budget. Look for free alternatives.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your entertainment budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of entertainment budget used.`;
        }
      
      case 'utilities':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your utilities budget. Consider energy-saving measures.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your utilities budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of utilities budget used.`;
        }
      
      case 'health & fitness':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your health budget. Review necessary expenses.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your health budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of health budget used.`;
        }
      
      case 'travel':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your travel budget. Consider budget travel options.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your travel budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of travel budget used.`;
        }
      
      case 'home & garden':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your home budget. Prioritize essential purchases.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your home budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of home budget used.`;
        }
      
      case 'personal care':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your personal care budget. Look for cost-effective alternatives.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your personal care budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of personal care budget used.`;
        }
      
      case 'education':
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your education budget. Explore payment plans.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your education budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of education budget used.`;
        }
      
      default:
        if (isOverBudget) {
          return `You're $${Math.abs(remaining!)} over your ${category.toLowerCase()} budget.`;
        } else if (budgetPercentage > 80) {
          return `You've used ${budgetPercentage.toFixed(0)}% of your ${category.toLowerCase()} budget.`;
        } else {
          return `You're on track with ${budgetPercentage.toFixed(0)}% of ${category.toLowerCase()} budget used.`;
        }
    }
  }
  
  /**
   * Generate spending insights
   */
  private static generateInsights(
    expenses: Transaction[], 
    totalSpending: number, 
    totalIncome: number, 
    savingsRate: number,
    topCategories: SpendingCategory[]
  ): BudgetInsight[] {
    const insights: BudgetInsight[] = [];
    
    // Savings rate insight
    if (savingsRate < 20) {
      insights.push({
        type: 'savings_opportunity',
        title: 'Low Savings Rate',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for 20% or higher for better financial security.`,
        severity: savingsRate < 10 ? 'high' : 'medium'
      });
    } else {
      insights.push({
        type: 'spending_pattern',
        title: 'Excellent Savings Rate',
        description: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income.`,
        severity: 'low'
      });
    }
    
    // High spending categories
    const categoryTotals = new Map<string, number>();
    expenses.forEach(tx => {
      const category = tx.user_category || tx.teller_category || 'Uncategorized';
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + Math.abs(tx.amount));
    });
    
    categoryTotals.forEach((total, category) => {
      const percentage = (total / totalSpending) * 100;
      if (percentage > 30) {
        insights.push({
          type: 'category_alert',
          title: 'High Category Spending',
          description: `${category} represents ${percentage.toFixed(1)}% of your total spending. Consider setting a budget for this category.`,
          severity: percentage > 40 ? 'high' : 'medium',
          category,
          amount: total,
          percentage
        });
      }
    });
    
    // Frequent small purchases (more realistic threshold)
    const smallTransactions = expenses.filter(tx => Math.abs(tx.amount) < 30);
    if (smallTransactions.length > expenses.length * 0.4) {
      insights.push({
        type: 'spending_pattern',
        title: 'Many Small Purchases',
        description: 'You have many small transactions under $30. These can add up quickly - consider tracking them more closely.',
        severity: 'medium'
      });
    }
    
    // High frequency categories
    const highFrequencyCategories = topCategories.filter(cat => cat.transactionCount > 10);
    if (highFrequencyCategories.length > 0) {
      const topFrequent = highFrequencyCategories[0];
      insights.push({
        type: 'spending_pattern',
        title: 'High Transaction Frequency',
        description: `${topFrequent.category} has ${topFrequent.transactionCount} transactions. Consider consolidating purchases to reduce fees.`,
        severity: 'low'
      });
    }
    
    return insights;
  }
  
  /**
   * Generate budget recommendations
   */
  private static generateBudgetRecommendations(
    categories: SpendingCategory[], 
    totalIncome: number
  ): BudgetRecommendation[] {
    const recommendations: BudgetRecommendation[] = [];
    
    categories.forEach(category => {
      const recommendedBudget = this.calculateRecommendedBudget(category.category, category.total, totalIncome);
      
      if (recommendedBudget !== category.total) {
        recommendations.push({
          category: category.category,
          currentSpending: category.total,
          recommendedBudget,
          reasoning: this.getBudgetReasoning(category.category, category.total, recommendedBudget),
          priority: category.total > recommendedBudget * 1.2 ? 'high' : 'medium'
        });
      }
    });
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * Calculate recommended budget for a category based on realistic spending patterns
   */
  private static calculateRecommendedBudget(category: string, currentSpending: number, totalIncome: number): number {
    const categoryBudgets: { [key: string]: number } = {
      'food & dining': 0.15,      // 15% - Most frequent category
      'transportation': 0.12,      // 12% - Regular commuting
      'shopping': 0.10,           // 10% - Regular retail
      'utilities': 0.08,          // 8% - Monthly bills
      'health & fitness': 0.06,   // 6% - Healthcare and fitness
      'entertainment': 0.05,      // 5% - Leisure activities
      'personal care': 0.04,      // 4% - Grooming and beauty
      'education': 0.03,          // 3% - Learning expenses
      'travel': 0.08,             // 8% - Occasional trips
      'home & garden': 0.04,      // 4% - Maintenance
      'business services': 0.02,  // 2% - Work-related
      'income': 0.00              // 0% - Income shouldn't have budget
    };
    
    const defaultPercentage = 0.03; // 3% for uncategorized
    const percentage = categoryBudgets[category.toLowerCase()] || defaultPercentage;
    
    return totalIncome * percentage;
  }
  
  /**
   * Get reasoning for budget recommendation
   */
  private static getBudgetReasoning(category: string, current: number, recommended: number): string {
    if (current > recommended * 1.2) {
      return `Current spending is ${((current / recommended - 1) * 100).toFixed(0)}% above recommended budget.`;
    } else if (current < recommended * 0.8) {
      return `You're spending ${((1 - current / recommended) * 100).toFixed(0)}% below recommended budget.`;
    }
    return 'Spending is within recommended range.';
  }
  
  /**
   * Generate monthly trend data based on realistic spending patterns
   */
  private static generateMonthlyTrend() {
    return [
      { month: 'Dec 2024', spending: 4850, income: 4870 },
      { month: 'Jan 2025', spending: 4120, income: 4870 },
      { month: 'Feb 2025', spending: 3980, income: 4870 }
    ];
  }
} 