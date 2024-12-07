import { read, utils } from 'xlsx';
import { Expense } from '../types/expense';
import { parseDate } from './dateUtils';

const SHEET_NAME = 'Detailed Transactions';

export const parseExcelFile = async (file: File): Promise<Expense[]> => {
  try {
    const data = await file.arrayBuffer();
    const workbook = read(data);

    if (!workbook.SheetNames.includes(SHEET_NAME)) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in the Excel file`);
    }

    const worksheet = workbook.Sheets[SHEET_NAME];
    const jsonData = utils.sheet_to_json(worksheet, { 
      raw: false,
      defval: '' // Default value for empty cells
    });

    console.log('Raw Excel Data:', jsonData); // Debug log

    return jsonData.map((row: any, index) => {
      // Log each row for debugging
      console.log('Processing row:', row);

      // Try to find date column with various possible names
      const dateValue = row.Date || row.DATE || row.date || row['תאריך'] || row.TransactionDate;
      const descriptionValue = row.Description || row.DESC || row['תיאור'] || row.TransactionDesc || '';
      const amountValue = row.Amount || row.AMOUNT || row['סכום'] || row.TransactionAmount || '0';
      const categoryValue = row.Category || row.CATEGORY || row['קטגוריה'] || '';

      const parsedDate = parseDate(dateValue);
      if (!parsedDate) {
        console.warn(`Invalid date in row ${index + 1}:`, dateValue);
      }

      // Parse amount: remove currency symbols and convert to number
      const cleanAmount = String(amountValue)
        .replace(/[^\d.-]/g, '')
        .replace(/^-/, ''); // Remove leading minus sign temporarily
      
      let amount = parseFloat(cleanAmount) || 0;
      
      // If original value had a minus sign, make the amount negative
      if (String(amountValue).startsWith('-')) {
        amount = -amount;
      }

      return {
        id: `expense-${index}`,
        date: parsedDate || new Date(),
        description: String(descriptionValue).trim(),
        amount: amount,
        category: String(categoryValue).trim() || 'Uncategorized',
        isRecognized: !!categoryValue
      };
    }).filter(expense => expense.amount !== 0); // Filter out zero-amount transactions
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to parse Excel file');
  }
};