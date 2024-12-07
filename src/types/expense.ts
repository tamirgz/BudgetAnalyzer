export interface Expense {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  isRecognized: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ExpenseAnalysis {
  totalExpenses: number;
  categoryTotals: Record<string, number>;
  monthlyTotals: Record<string, number>;
}