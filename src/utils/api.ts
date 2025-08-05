// Use direct fetch for API calls since we have a REST API endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.placeholder.com';

const apiRequest = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const get = (path: string, queryParams: Record<string, string | number | boolean> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;
  
  return apiRequest(fullPath);
};

export const post = (path: string, body: unknown) => 
  apiRequest(path, { method: 'POST', body: JSON.stringify(body) });

export const put = (path: string, body: unknown) => 
  apiRequest(path, { method: 'PUT', body: JSON.stringify(body) });

export const del = (path: string) => 
  apiRequest(path, { method: 'DELETE' });
