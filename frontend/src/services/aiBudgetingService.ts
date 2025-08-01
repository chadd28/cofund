import { Transaction } from '../types/transaction';

export interface SpendingCategory {
  category: string;
  total: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation?: string;
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
    
    // Generate top categories
    const topCategories: SpendingCategory[] = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        total: data.total,
        percentage: (data.total / totalSpending) * 100,
        transactionCount: data.count,
        averageAmount: data.total / data.count,
        trend: this.analyzeTrend(data.amounts),
        recommendation: this.generateCategoryRecommendation(category, data.total, data.count)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
    
    // Generate insights
    const insights = this.generateInsights(expenses, totalSpending, totalIncome, savingsRate);
    
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
   * Analyze spending trend for a category
   */
  private static analyzeTrend(amounts: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (amounts.length < 2) return 'stable';
    
    const recent = amounts.slice(-3);
    const older = amounts.slice(0, -3);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }
  
  /**
   * Generate category-specific recommendations
   */
  private static generateCategoryRecommendation(category: string, total: number, count: number): string {
    const average = total / count;
    
    switch (category.toLowerCase()) {
      case 'groceries':
        return average > 100 ? 'Consider meal planning to reduce grocery costs' : 'Great job keeping grocery costs low!';
      case 'dining out':
        return average > 50 ? 'Try cooking at home more often to save money' : 'Good balance of dining out and home cooking';
      case 'entertainment':
        return average > 100 ? 'Look for free or low-cost entertainment options' : 'Reasonable entertainment spending';
      case 'transportation':
        return average > 200 ? 'Consider carpooling or public transportation' : 'Efficient transportation spending';
      case 'utilities':
        return average > 150 ? 'Check for energy-saving opportunities' : 'Good utility management';
      default:
        return count > 10 ? 'High transaction frequency - consider consolidating' : 'Manageable spending pattern';
    }
  }
  
  /**
   * Generate spending insights
   */
  private static generateInsights(
    expenses: Transaction[], 
    totalSpending: number, 
    totalIncome: number, 
    savingsRate: number
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
    
    // Frequent small purchases
    const smallTransactions = expenses.filter(tx => Math.abs(tx.amount) < 20);
    if (smallTransactions.length > expenses.length * 0.6) {
      insights.push({
        type: 'spending_pattern',
        title: 'Many Small Purchases',
        description: 'You have many small transactions. These can add up quickly - consider tracking them more closely.',
        severity: 'medium'
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
   * Calculate recommended budget for a category
   */
  private static calculateRecommendedBudget(category: string, currentSpending: number, totalIncome: number): number {
    const categoryBudgets: { [key: string]: number } = {
      'groceries': 0.12,
      'dining out': 0.08,
      'entertainment': 0.05,
      'transportation': 0.15,
      'utilities': 0.08,
      'healthcare': 0.10,
      'shopping': 0.08,
      'personal care': 0.03
    };
    
    const defaultPercentage = 0.05; // 5% for uncategorized
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
   * Generate monthly trend data (mock for demo)
   */
  private static generateMonthlyTrend() {
    return [
      { month: 'May 2025', spending: 3200, income: 5000 },
      { month: 'June 2025', spending: 2800, income: 5000 },
      { month: 'July 2025', spending: 3100, income: 5000 }
    ];
  }
} 