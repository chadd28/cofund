import { useAuth } from '../contexts/AuthContext';
import { useBudget } from '../contexts/BudgetContext';

/**
 * Custom hook that combines authentication and budget context functionality
 * This allows the auth context to reset budget state when users log in
 */
export const useAuthWithBudget = () => {
  const auth = useAuth();
  const budget = useBudget();

  const signInWithBudgetReset = async (userData: any) => {
    // Reset budget state when user logs in
    budget.resetBudgetState();
    // Call the original signIn function
    return auth.signIn(userData);
  };

  return {
    ...auth,
    ...budget,
    signInWithBudgetReset,
  };
}; 