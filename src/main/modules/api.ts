import axios from 'axios';

import { getApiUrl } from '@/modules/config';

export async function get<T>(endpoint: string, params?: object): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await axios.get<T>(url, { params, timeout: 5000 });
  return response.data;
}

export async function post<T>(endpoint: string, data: object): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await axios.post<T>(url, data, { timeout: 5000 });
  return response.data;
}

export async function put<T>(endpoint: string, data: object): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await axios.put<T>(url, data, { timeout: 5000 });
  return response.data;
}

export async function del<T>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await axios.delete<T>(url, { timeout: 5000 });
  return response.data;
}
