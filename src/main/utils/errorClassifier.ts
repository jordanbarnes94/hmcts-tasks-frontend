import { isAxiosError } from 'axios';

export type AxiosErrorResult =
  | { status: 404 }
  | { status: 400; validationErrors: Record<string, string> | null; message: string }
  | { status: 'other' };

/**
 * Classify an unknown error caught from an Axios request into a typed result.
 * Routes can switch on the result instead of repeating isAxiosError checks.
 */
export function classifyAxiosError(error: unknown): AxiosErrorResult {
  if (isAxiosError(error) && error.response) {
    if (error.response.status === 404) {
      return { status: 404 };
    }
    if (error.response.status === 400) {
      return {
        status: 400,
        validationErrors: error.response.data.validationErrors ?? null,
        message: error.response.data.message ?? 'Validation failed',
      };
    }
  }
  return { status: 'other' };
}
