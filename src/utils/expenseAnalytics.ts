import { Expense, ExpenseAnalysis } from '../types/expense';
import { 
  calculateTotalExpenses,
  calculateCategoryTotals,
  calculateMonthlyTotals
} from './calculationUtils';

export const analyzeExpenses = (expenses: Expense[]): ExpenseAnalysis => {
  return {
    totalExpenses: calculateTotalExpenses(expenses),
    categoryTotals: calculateCategoryTotals(expenses),
    monthlyTotals: calculateMonthlyTotals(expenses)
  };
};