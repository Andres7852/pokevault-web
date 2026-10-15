import { API_BASE_URL } from './config';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;
  const token = typeof window !== 'undefined' ? localStorage.getItem('pokevault_token') : null;
  const defaultHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: { ...defaultHeaders, ...headers },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, config);

  // Redirigir por sesión expirada SOLO si no estamos en login
  if (response.status === 401 && typeof window !== 'undefined' && !cleanEndpoint.includes('/auth/login')) {
    localStorage.removeItem('pokevault_token');
    localStorage.removeItem('pokevault_user');
    window.location.href = '/login?expired=true';
  }

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resData.error || `Error ${response.status}: ${response.statusText}`);
  }

  return resData as T;
}