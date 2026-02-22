/**
 * Validate task form fields before submitting to the API.
 *
 * @param title - Task title field value
 * @param day - Due date day field value
 * @param month - Due date month field value
 * @param year - Due date year field value
 * @param status - Status field value (optional, only validated when provided as empty string)
 * @returns An errors object keyed by field name, or an empty object if valid
 */
export function validateTaskForm({
  title,
  day,
  month,
  year,
  status,
}: {
  title: string;
  day: string;
  month: string;
  year: string;
  status?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!title) {
    errors.title = 'Enter a title';
  }

  if (!day || !month || !year) {
    errors.dueDate = 'Enter a due date';
  } else {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Reject non-numeric values or numbers obviously outside valid ranges
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31 || isNaN(monthNum) || monthNum < 1 || monthNum > 12 || isNaN(yearNum) || year.length !== 4) {
      errors.dueDate = 'Enter a real due date';
    } else {
      // Catch dates that pass range checks but don't exist (e.g. Feb 30, Apr 31).
      // JavaScript's Date constructor silently overflows invalid dates (e.g. Apr 31 becomes May 1),
      // so if the constructed date's month or day doesn't match what was entered, the date was invalid.
      const testDate = new Date(yearNum, monthNum - 1, dayNum);
      if (testDate.getMonth() !== monthNum - 1 || testDate.getDate() !== dayNum) {
        errors.dueDate = 'Enter a real due date';
      }
    }
  }

  if (status !== undefined && !status) {
    errors.status = 'Select a status';
  }

  return errors;
}

/**
 * Map a backend validationErrors response to user-friendly field error messages
 * for use in form templates.
 *
 * Only known fields are included - unknown backend fields are ignored.
 *
 * @param validationErrors - The validationErrors object from the API 400 response
 * @returns An errors object keyed by field name, suitable for passing to the form template
 */
export function constructErrors(validationErrors: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (validationErrors.title) {
    errors.title = 'Enter a title';
  }

  if (validationErrors.description) {
    errors.description = 'Enter a description';
  }

  if (validationErrors.dueDate) {
    errors.dueDate = 'Enter a valid due date';
  }

  if (validationErrors.status) {
    errors.status = 'Select a status';
  }

  return errors;
}
