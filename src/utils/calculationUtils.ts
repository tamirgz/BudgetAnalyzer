import { Expense } from '../types/expense';
import { format } from 'date-fns';

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + Math.abs(expense.amount), 0);
};

export const calculateCategoryTotals = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((totals, expense) => {
    const category = expense.category || 'Uncategorized';
    totals[category] = (totals[category] || 0) + Math.abs(expense.amount);
    return totals;
  }, {} as Record<string, number>);
};

export const calculateMonthlyTotals = (expenses: Expense[]): Record<string, number> => {
  const totals: Record<string, number> = {};
  
  expenses.forEach(expense => {
    if (expense.date instanceof Date && !isNaN(expense.date.getTime())) {
      const monthKey = format(expense.date, 'yyyy-MM');
      totals[monthKey] = (totals[monthKey] || 0) + Math.abs(expense.amount);
    }
  });

  // Sort months chronologically
  return Object.fromEntries(
    Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))
  );
};