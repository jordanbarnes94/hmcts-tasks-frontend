import config from 'config';

/**
 * Get the API base URL from configuration (just the host).
 * Reads from config files based on NODE_ENV:
 * - development: config/development.json
 * - production: config/production.json
 * - test: config/test.json
 * - default: config/default.json
 *
 * @returns Base URL without trailing slash (e.g., 'http://localhost:4000')
 */
export function getApiBaseUrl(): string {
  return config.get('api.baseUrl');
}

/**
 * Get the API base path from configuration.
 *
 * @returns Base path (e.g., '/api')
 */
export function getApiBasePath(): string {
  return config.get('api.basePath');
}

/**
 * Get the full API endpoint URL by combining base URL, base path, and endpoint.
 *
 * @param endpoint - API endpoint path (e.g., 'tasks' or 'tasks/123')
 * @returns Full URL (e.g., 'http://localhost:4000/api/tasks')
 *
 * @example
 * getApiUrl('tasks') // → 'http://localhost:4000/api/tasks'
 */
export function getApiUrl(endpoint: string): string {
  // Expect: 'tasks', 'tasks/123', 'tasks/123/status'
  // Do NOT expect: '/tasks' or 'tasks/'
  return `${getApiBaseUrl()}${getApiBasePath()}/${endpoint}`;
}

export default {
  getApiBaseUrl,
  getApiBasePath,
  getApiUrl,
};
