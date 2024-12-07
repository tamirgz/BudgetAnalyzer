import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/currencyUtils';
import { format } from 'date-fns';
import { GripVertical } from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: expense.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const isNegative = expense.amount < 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 mb-2 rounded-lg ${
        isNegative ? 'bg-red-50' : 'bg-green-50'
      } shadow hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="font-medium">{expense.description}</p>
            <p className="text-sm text-gray-500">
              {format(expense.date, 'dd/MM/yyyy')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold text-lg ${
            isNegative ? 'text-red-600' : 'text-green-600'
          }`}>
            {formatCurrency(expense.amount)}
          </p>
          <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-800">
            {expense.category}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ExpenseListProps {
  expenses: Expense[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
};