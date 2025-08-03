import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BudgetContextType {
  budgetCreated: boolean;
  setBudgetCreated: (created: boolean) => void;
  resetBudgetState: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [budgetCreated, setBudgetCreated] = useState(false);

  const resetBudgetState = () => {
    setBudgetCreated(false);
  };

  return (
    <BudgetContext.Provider value={{ budgetCreated, setBudgetCreated, resetBudgetState }}>
      {children}
    </BudgetContext.Provider>
  );
}; 