import { Expense } from '../types/expense';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const convertToILS = (amount: number): number => {
  // Assuming the input is in USD, convert to ILS
  const USD_TO_ILS_RATE = 3.5; // You might want to use a real-time exchange rate API
  return amount * USD_TO_ILS_RATE;
};