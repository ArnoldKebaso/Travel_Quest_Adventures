/**
 * Input Sanitization Utilities
 * Provides security functions to clean and validate user input
 */

import { SPAM_PATTERNS } from '../constants';

/**
 * Sanitizes HTML and script tags from input strings
 * Removes potentially dangerous HTML elements and JavaScript
 */
export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Remove script tags and their content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    // Remove HTML tags but keep the content
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove onload, onclick, etc. event handlers
    .replace(/on\w+\s*=/gi, '')
    // Trim whitespace
    .trim();
};

/**
 * Sanitizes an object recursively
 * Applies string sanitization to all string properties
 */
export const sanitizeObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeHtml(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
};

/**
 * Validates numeric input and converts strings to numbers
 * Returns 0 for invalid numeric inputs
 */
export const sanitizeNumeric = (input: any): number => {
  const num = parseFloat(input);
  return isNaN(num) ? 0 : num;
};

/**
 * Validates email format
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeHtml(email.toLowerCase().trim());
  
  return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Detects spam content using predefined patterns
 */
export const detectSpam = (content: string): boolean => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  return SPAM_PATTERNS.some(pattern => pattern.test(content));
};

/**
 * Validates and sanitizes URL inputs
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }
    return urlObj.toString();
  } catch {
    return '';
  }
};

/**
 * Validates and sanitizes destination input data
 * Specific sanitization for destination objects
 */
export const sanitizeDestinationInput = (input: any): any => {
  const sanitized = sanitizeObject(input);
  
  // Additional validation for destination-specific fields
  if (sanitized.price !== undefined) {
    sanitized.price = sanitizeNumeric(sanitized.price);
  }
  
  if (sanitized.rating !== undefined) {
    sanitized.rating = Math.max(0, Math.min(5, sanitizeNumeric(sanitized.rating)));
  }
  
  if (sanitized.reviewCount !== undefined) {
    sanitized.reviewCount = Math.max(0, sanitizeNumeric(sanitized.reviewCount));
  }

  if (sanitized.image && typeof sanitized.image === 'string') {
    sanitized.image = sanitizeUrl(sanitized.image) || '';
  }

  // Ensure arrays are properly initialized
  if (!Array.isArray(sanitized.highlights)) {
    sanitized.highlights = [];
  }

  return sanitized;
};

/**
 * Validates required fields in an object
 */
export const validateRequired = (obj: any, requiredFields: string[]): { isValid: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  for (const field of requiredFields) {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      missing.push(field);
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

/**
 * Validates string length constraints
 */
export const validateStringLength = (str: string, minLength: number = 0, maxLength: number = 1000): boolean => {
  if (!str || typeof str !== 'string') {
    return minLength === 0;
  }
  
  const length = str.trim().length;
  return length >= minLength && length <= maxLength;
};

/**
 * Comprehensive input validation and sanitization for API requests
 */
export const validateAndSanitizeInput = (input: any, schema: any = {}): { isValid: boolean; sanitized: any; errors: string[] } => {
  const errors: string[] = [];
  let sanitized = sanitizeObject(input);
  
  // Apply schema-specific validations
  if (schema.maxLength) {
    for (const [field, maxLen] of Object.entries(schema.maxLength)) {
      if (sanitized[field] && !validateStringLength(sanitized[field], 0, maxLen as number)) {
        errors.push(`${field} exceeds maximum length of ${maxLen}`);
      }
    }
  }
  
  if (schema.required) {
    const validation = validateRequired(sanitized, schema.required);
    if (!validation.isValid) {
      errors.push(`Missing required fields: ${validation.missing.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};
