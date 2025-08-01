import { Transaction } from '../types/transaction';

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  categoryPercentages: { [key: string]: number };
  totalIncome: number;
  savingsRate: number;
  isRecommended: boolean;
}

export interface BudgetCategory {
  category: string;
  currentSpending: number;
  suggestedBudget: number;
  percentage: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  tips: string[];
}

export interface AIBudgetSuggestion {
  template: BudgetTemplate;
  categories: BudgetCategory[];
  totalBudget: number;
  estimatedSavings: number;
  confidence: number;
  reasoning: string;
  goals: BudgetGoal[];
}

export interface BudgetCreationRequest {
  monthlyIncome: number;
  financialGoals: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  lifestyle: 'minimalist' | 'balanced' | 'luxury';
  emergencyFund: number;
  debtPayments: number;
}

/**
 * AI Budget Creation Service - Helps users create personalized budgets
 */
export class AIBudgetCreationService {
  /**
   * Generate AI-powered budget suggestions based on user preferences and spending patterns
   */
  static generateBudgetSuggestions(
    transactions: Transaction[],
    request: BudgetCreationRequest
  ): AIBudgetSuggestion[] {
    const suggestions: AIBudgetSuggestion[] = [];
    
    // Analyze current spending patterns
    const spendingAnalysis = this.analyzeCurrentSpending(transactions);
    
    // Generate different budget templates based on user preferences
    const templates = this.generateBudgetTemplates(request, spendingAnalysis);
    
    // Create suggestions for each template
    templates.forEach(template => {
      const categories = this.generateBudgetCategories(
        template,
        spendingAnalysis,
        request
      );
      
      const totalBudget = Object.values(categories).reduce(
        (sum, cat) => sum + cat.suggestedBudget,
        0
      );
      
      const estimatedSavings = request.monthlyIncome - totalBudget;
      
      const goals = this.generateFinancialGoals(request, estimatedSavings);
      
      suggestions.push({
        template,
        categories: Object.values(categories),
        totalBudget,
        estimatedSavings,
        confidence: this.calculateConfidence(template, spendingAnalysis),
        reasoning: this.generateReasoning(template, request, spendingAnalysis),
        goals
      });
    });
    
    // Sort by confidence and return top 3 suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }
  
  /**
   * Analyze current spending patterns
   */
  private static analyzeCurrentSpending(transactions: Transaction[]) {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const totalSpending = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    const categorySpending: { [key: string]: number } = {};
    expenses.forEach(tx => {
      const category = tx.user_category || tx.teller_category || 'Uncategorized';
      categorySpending[category] = (categorySpending[category] || 0) + Math.abs(tx.amount);
    });
    
    return {
      totalSpending,
      categorySpending,
      averageTransactionSize: totalSpending / expenses.length || 0,
      transactionCount: expenses.length
    };
  }
  
  /**
   * Generate budget templates based on user preferences
   */
  private static generateBudgetTemplates(
    request: BudgetCreationRequest,
    spendingAnalysis: any
  ): BudgetTemplate[] {
    const templates: BudgetTemplate[] = [];
    
    // Conservative template (50/30/20 rule)
    templates.push({
      id: 'conservative-50-30-20',
      name: 'Conservative Budget (50/30/20 Rule)',
      description: 'Traditional budgeting approach: 50% needs, 30% wants, 20% savings',
      categoryPercentages: {
        'Housing': 0.25,
        'Transportation': 0.10,
        'Utilities': 0.05,
        'Groceries': 0.10,
        'Healthcare': 0.05,
        'Insurance': 0.05,
        'Dining Out': 0.05,
        'Entertainment': 0.05,
        'Shopping': 0.05,
        'Personal Care': 0.02,
        'Education': 0.03,
        'Savings': 0.20
      },
      totalIncome: request.monthlyIncome,
      savingsRate: 0.20,
      isRecommended: request.riskTolerance === 'conservative'
    });
    
    // Balanced template
    templates.push({
      id: 'balanced-flexible',
      name: 'Balanced Flexible Budget',
      description: 'Balanced approach with room for lifestyle choices',
      categoryPercentages: {
        'Housing': 0.20,
        'Transportation': 0.08,
        'Utilities': 0.04,
        'Groceries': 0.08,
        'Healthcare': 0.04,
        'Insurance': 0.04,
        'Dining Out': 0.08,
        'Entertainment': 0.08,
        'Shopping': 0.08,
        'Personal Care': 0.03,
        'Education': 0.02,
        'Savings': 0.15
      },
      totalIncome: request.monthlyIncome,
      savingsRate: 0.15,
      isRecommended: request.riskTolerance === 'moderate'
    });
    
    // Aggressive savings template
    templates.push({
      id: 'aggressive-savings',
      name: 'Aggressive Savings Budget',
      description: 'Maximize savings while maintaining essential spending',
      categoryPercentages: {
        'Housing': 0.15,
        'Transportation': 0.06,
        'Utilities': 0.03,
        'Groceries': 0.06,
        'Healthcare': 0.03,
        'Insurance': 0.03,
        'Dining Out': 0.03,
        'Entertainment': 0.03,
        'Shopping': 0.03,
        'Personal Care': 0.02,
        'Education': 0.02,
        'Savings': 0.50
      },
      totalIncome: request.monthlyIncome,
      savingsRate: 0.50,
      isRecommended: request.riskTolerance === 'aggressive'
    });
    
    return templates;
  }
  
  /**
   * Generate budget categories with AI recommendations
   */
  private static generateBudgetCategories(
    template: BudgetTemplate,
    spendingAnalysis: any,
    request: BudgetCreationRequest
  ): { [key: string]: BudgetCategory } {
    const categories: { [key: string]: BudgetCategory } = {};
    
    Object.entries(template.categoryPercentages).forEach(([category, percentage]) => {
      if (category === 'Savings') return; // Handle savings separately
      
      const suggestedBudget = request.monthlyIncome * percentage;
      const currentSpending = spendingAnalysis.categorySpending[category] || 0;
      
      const priority = this.determinePriority(currentSpending, suggestedBudget);
      const reasoning = this.generateCategoryReasoning(category, currentSpending, suggestedBudget, request);
      const tips = this.generateCategoryTips(category, currentSpending, suggestedBudget, request);
      
      categories[category] = {
        category,
        currentSpending,
        suggestedBudget,
        percentage: percentage * 100,
        priority,
        reasoning,
        tips
      };
    });
    
    return categories;
  }
  
  /**
   * Determine priority level for a category
   */
  private static determinePriority(current: number, suggested: number): 'high' | 'medium' | 'low' {
    const ratio = current / suggested;
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  }
  
  /**
   * Generate reasoning for category budget
   */
  private static generateCategoryReasoning(
    category: string,
    current: number,
    suggested: number,
    request: BudgetCreationRequest
  ): string {
    const ratio = current / suggested;
    
    if (ratio > 1.5) {
      return `Your current spending is ${Math.round((ratio - 1) * 100)}% above the recommended budget. Consider reducing expenses in this category.`;
    } else if (ratio > 1.2) {
      return `Your spending is slightly above the recommended budget. Look for ways to optimize without major lifestyle changes.`;
    } else if (ratio < 0.8) {
      return `You're spending well below the recommended budget. You have room to increase spending if needed.`;
    } else {
      return `Your spending aligns well with the recommended budget. Keep up the good work!`;
    }
  }
  
  /**
   * Generate tips for budget categories
   */
  private static generateCategoryTips(
    category: string,
    current: number,
    suggested: number,
    request: BudgetCreationRequest
  ): string[] {
    const tips: string[] = [];
    const ratio = current / suggested;
    
    switch (category.toLowerCase()) {
      case 'groceries':
        if (ratio > 1.2) {
          tips.push('Plan meals in advance to reduce food waste');
          tips.push('Use grocery store apps for deals and coupons');
          tips.push('Buy in bulk for non-perishable items');
        }
        break;
      case 'dining out':
        if (ratio > 1.2) {
          tips.push('Set a weekly dining out budget');
          tips.push('Cook at home more often');
          tips.push('Use restaurant loyalty programs');
        }
        break;
      case 'entertainment':
        if (ratio > 1.2) {
          tips.push('Look for free community events');
          tips.push('Use streaming services instead of cable');
          tips.push('Find budget-friendly hobbies');
        }
        break;
      case 'transportation':
        if (ratio > 1.2) {
          tips.push('Consider carpooling or public transportation');
          tips.push('Maintain your vehicle regularly');
          tips.push('Combine errands to reduce trips');
        }
        break;
      case 'shopping':
        if (ratio > 1.2) {
          tips.push('Wait 24 hours before making non-essential purchases');
          tips.push('Use price comparison tools');
          tips.push('Shop during sales and clearance events');
        }
        break;
    }
    
    return tips;
  }
  
  /**
   * Generate financial goals based on user preferences
   */
  private static generateFinancialGoals(
    request: BudgetCreationRequest,
    estimatedSavings: number
  ): BudgetGoal[] {
    const goals: BudgetGoal[] = [];
    
    // Emergency fund goal
    if (request.emergencyFund < 6 * (request.monthlyIncome / 12)) {
      goals.push({
        id: 'emergency-fund',
        name: 'Emergency Fund',
        targetAmount: 6 * (request.monthlyIncome / 12),
        currentAmount: request.emergencyFund,
        deadline: this.calculateDeadline(request.emergencyFund, 6 * (request.monthlyIncome / 12), estimatedSavings),
        priority: 'high',
        category: 'Savings'
      });
    }
    
    // Debt payoff goal
    if (request.debtPayments > 0) {
      goals.push({
        id: 'debt-payoff',
        name: 'Debt Payoff',
        targetAmount: request.debtPayments,
        currentAmount: 0,
        deadline: this.calculateDeadline(0, request.debtPayments, estimatedSavings * 0.3),
        priority: 'high',
        category: 'Debt'
      });
    }
    
    // Custom goals based on user preferences
    request.financialGoals.forEach((goal, index) => {
      const targetAmount = this.estimateGoalAmount(goal, request.monthlyIncome);
      goals.push({
        id: `goal-${index}`,
        name: goal,
        targetAmount,
        currentAmount: 0,
        deadline: this.calculateDeadline(0, targetAmount, estimatedSavings * 0.2),
        priority: 'medium',
        category: 'Goals'
      });
    });
    
    return goals;
  }
  
  /**
   * Calculate deadline for a goal
   */
  private static calculateDeadline(current: number, target: number, monthlyContribution: number): string {
    const monthsNeeded = Math.ceil((target - current) / monthlyContribution);
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + monthsNeeded);
    return deadline.toISOString().split('T')[0];
  }
  
  /**
   * Estimate goal amount based on goal type
   */
  private static estimateGoalAmount(goal: string, monthlyIncome: number): number {
    const goalLower = goal.toLowerCase();
    
    if (goalLower.includes('vacation') || goalLower.includes('travel')) {
      return monthlyIncome * 2;
    } else if (goalLower.includes('house') || goalLower.includes('home')) {
      return monthlyIncome * 20;
    } else if (goalLower.includes('car') || goalLower.includes('vehicle')) {
      return monthlyIncome * 6;
    } else if (goalLower.includes('wedding')) {
      return monthlyIncome * 12;
    } else if (goalLower.includes('education') || goalLower.includes('school')) {
      return monthlyIncome * 8;
    } else {
      return monthlyIncome * 3; // Default goal amount
    }
  }
  
  /**
   * Calculate confidence score for a budget suggestion
   */
  private static calculateConfidence(template: BudgetTemplate, spendingAnalysis: any): number {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on how well current spending aligns with template
    const totalSpending = spendingAnalysis.totalSpending;
    const templateTotal = template.totalIncome * (1 - template.savingsRate);
    
    const spendingRatio = totalSpending / templateTotal;
    if (spendingRatio >= 0.8 && spendingRatio <= 1.2) {
      confidence += 0.2;
    } else if (spendingRatio >= 0.6 && spendingRatio <= 1.4) {
      confidence += 0.1;
    }
    
    // Adjust based on transaction count (more data = higher confidence)
    if (spendingAnalysis.transactionCount > 20) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Generate reasoning for the budget suggestion
   */
  private static generateReasoning(
    template: BudgetTemplate,
    request: BudgetCreationRequest,
    spendingAnalysis: any
  ): string {
    const savingsRate = template.savingsRate * 100;
    const monthlySavings = request.monthlyIncome * template.savingsRate;
    
    let reasoning = `This ${template.name.toLowerCase()} allocates ${savingsRate}% of your income to savings, `;
    reasoning += `allowing you to save $${monthlySavings.toFixed(0)} per month. `;
    
    if (request.riskTolerance === 'conservative') {
      reasoning += 'This conservative approach prioritizes financial security and stability.';
    } else if (request.riskTolerance === 'moderate') {
      reasoning += 'This balanced approach provides flexibility while maintaining good savings habits.';
    } else {
      reasoning += 'This aggressive approach maximizes your savings potential for faster goal achievement.';
    }
    
    return reasoning;
  }
} 