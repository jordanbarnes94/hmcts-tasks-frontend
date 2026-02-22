import { Response } from 'express';

/**
 * Redirect to a URL with flash message query parameters.
 * Templates read flashMessageText and flashMessageType to render a notification banner.
 */
export function redirectWithFlash(res: Response, url: string, message: string, type: 'success' | 'error' = 'success'): void {
  const params = new URLSearchParams({ flashMessageText: message, flashMessageType: type });
  const separator = url.includes('?') ? '&' : '?';
  res.redirect(`${url}${separator}${params}`);
}
