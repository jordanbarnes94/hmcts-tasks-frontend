import { Request } from 'express';

import { TaskSearchParams } from '@/types/task';
import { parseGovUkDate } from '@/utils/dateHelper';

/**
 * Extract task search parameters from Express query object.
 *
 * @param query - Express request query object (req.query)
 * @returns Typed TaskSearchParams ready for API calls
 */
export function extractTaskSearchParams(query: Request['query']): TaskSearchParams {
  const page = parseInt(query.page as string) || 0;
  const size = parseInt(query.size as string) || 20;
  const search = query.search ? String(query.search).trim() : undefined;
  const status = query.status ? String(query.status) : undefined;

  const dueDateFrom = parseGovUkDate(
    query['dueDateFrom-day'] as string,
    query['dueDateFrom-month'] as string,
    query['dueDateFrom-year'] as string
  );

  const dueDateTo = parseGovUkDate(
    query['dueDateTo-day'] as string,
    query['dueDateTo-month'] as string,
    query['dueDateTo-year'] as string
  );

  return { page, size, search, status, dueDateFrom, dueDateTo };
}
