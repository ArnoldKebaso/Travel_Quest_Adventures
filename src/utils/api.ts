import { API } from 'aws-amplify';

const API_NAME = 'TravelQuestAPI';

export const get = (path: string, queryParams: Record<string, any> = {}) => 
  API.get(API_NAME, path, { queryStringParameters: queryParams });

export const post = (path: string, body: any) => 
  API.post(API_NAME, path, { body });

export const put = (path: string, body: any) => 
  API.put(API_NAME, path, { body });

export const del = (path: string) => 
  API.del(API_NAME, path, {});

// Fallback for direct fetch if Amplify API isn't working
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.placeholder.com';

export const fetchAPI = async (path: string, options: RequestInit = {}) => {
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
