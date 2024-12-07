import { isValid, parse, parseISO } from 'date-fns';

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  // Try common date formats
  const dateFormats = [
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy',
    'dd-MM-yyyy',
    'dd.MM.yyyy',
    'yyyy/MM/dd'
  ];

  // Try parsing with each format
  for (const format of dateFormats) {
    try {
      const parsedDate = parse(dateString, format, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (e) {
      continue;
    }
  }

  // Try parsing as ISO string
  try {
    const isoDate = parseISO(dateString);
    if (isValid(isoDate)) {
      return isoDate;
    }
  } catch (e) {
    // Continue to next attempt
  }

  // Try parsing as Excel serial number
  const numericDate = Number(dateString);
  if (!isNaN(numericDate)) {
    // Excel dates are counted from 1900-01-01
    const excelDate = new Date(1900, 0, 1);
    excelDate.setDate(excelDate.getDate() + numericDate - 2); // -2 to adjust for Excel's date system
    if (isValid(excelDate)) {
      return excelDate;
    }
  }

  // If all else fails, try native Date parsing
  const fallbackDate = new Date(dateString);
  return isValid(fallbackDate) ? fallbackDate : null;
};