// API 基础工具函数
// 请根据实际的 API 地址修改 BASE_URL

import { API_BASE_URL } from '../constants/api';
const BASE_URL = `${API_BASE_URL}/api`;

async function request<T = any>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function apiGet<T = any>(url: string): Promise<T> {
  return request<T>(url);
}

export async function apiPost<T = any>(url: string, body?: any): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T = any>(url: string, body?: any): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' });
}

export default { apiGet, apiPost, apiPut, apiDelete };