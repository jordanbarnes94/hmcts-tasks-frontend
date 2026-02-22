/**
 * Parse GOV.UK date component inputs into an ISO datetime string (YYYY-MM-DDTHH:MM:SS format).
 * Returns undefined if any component is missing.
 *
 * @param day - Day component (1-31)
 * @param month - Month component (1-12)
 * @param year - Year component (4 digits)
 * @returns ISO datetime string (YYYY-MM-DDTHH:MM:SS) or undefined
 *
 * @example
 * parseGovUkDate('15', '3', '2024') // → '2024-03-15T00:00:00'
 * parseGovUkDate('5', '12', '2024') // → '2024-12-05T00:00:00'
 * parseGovUkDate('', '3', '2024')   // → undefined
 */
export function parseGovUkDate(day?: string, month?: string, year?: string): string | undefined {
  if (!day || !month || !year) {
    return undefined;
  }

  const paddedDay = day.padStart(2, '0');
  const paddedMonth = month.padStart(2, '0');

  return `${year}-${paddedMonth}-${paddedDay}T00:00:00`;
}

/**
 * Extract GOV.UK date input components from an ISO datetime string.
 *
 * @param isoDateString - ISO date string (e.g., '2024-03-15T00:00:00')
 * @returns Object with day, month, year as strings
 *
 * @example
 * extractDateComponents('2024-03-15T00:00:00') // → { day: '15', month: '3', year: '2024' }
 */
export function extractDateComponents(isoDateString: string): { day: string; month: string; year: string } {
  const [datePart] = isoDateString.split('T');
  const [year, month, day] = datePart.split('-');
  return {
    day: String(parseInt(day, 10)),
    month: String(parseInt(month, 10)),
    year,
  };
}

/**
 * Format an ISO date string for display in UK format WITHOUT time.
 * Use this for date-only fields like dueDate.
 *
 * @param isoDateString - ISO date string (e.g., '2024-03-15T00:00:00')
 * @returns Formatted date string (e.g., '15 March 2024')
 *
 * @example
 * formatDate('2024-03-15T00:00:00') // → '15 March 2024'
 */
export function formatDate(isoDateString: string): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  };

  const utcString = isoDateString.endsWith('Z') || isoDateString.includes('+') ? isoDateString : `${isoDateString}Z`;
  return new Date(utcString).toLocaleDateString('en-GB', formatOptions);
}

/**
 * Format an ISO date string for display in UK format with time.
 * Use this for timestamps like createdAt, updatedAt.
 *
 * @param isoDateString - ISO date string (e.g., '2024-03-15T10:30:00')
 * @returns Formatted datetime string (e.g., '15 March 2024, 10:30:00')
 *
 * @example
 * formatDateTime('2024-03-15T10:30:00') // → '15 March 2024, 10:30:00'
 */
export function formatDateTime(isoDateString: string): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  };

  const utcString = isoDateString.endsWith('Z') || isoDateString.includes('+') ? isoDateString : `${isoDateString}Z`;
  return new Date(utcString).toLocaleString('en-GB', formatOptions);
}
