import { APIGatewayProxyResult } from 'aws-lambda';
import { APIResponse } from '../models';

export const createResponse = <T>(
  statusCode: number,
  data: T | null,
  message: string
): APIGatewayProxyResult => {
  const response: APIResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify(response),
  };
};

export const validateRequired = (
  body: Record<string, unknown>,
  requiredFields: string[]
): { isValid: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  for (const field of requiredFields) {
    if (!body[field] || (typeof body[field] === 'string' && body[field] === '')) {
      missing.push(field);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
};

export const parseQueryParams = (
  queryStringParameters: Record<string, string> | null
): Record<string, string> => {
  return queryStringParameters || {};
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const parseNumber = (value: string | number | undefined, defaultValue: number = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
