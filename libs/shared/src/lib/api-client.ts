const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const apiClient = {
  get<T>(url: string) {
    return fetchApi<T>(url);
  },
  post<T>(url: string, data: unknown) {
    return fetchApi<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  delete<T>(url: string) {
    return fetchApi<T>(url, { method: 'DELETE' });
  },
};
