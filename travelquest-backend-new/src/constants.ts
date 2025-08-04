/**
 * Constants for TravelQuest Backend API
 * Centralized configuration to avoid string literals throughout the codebase
 */

// DynamoDB Table Names
export const TABLE_NAMES = {
  DESTINATIONS: process.env.DESTINATIONS_TABLE || 'travelquest-destinations',
  TOURS: process.env.TOURS_TABLE || 'travelquest-tours',
  BLOGS: process.env.BLOGS_TABLE || 'travelquest-blogs',
  COMMENTS: process.env.COMMENTS_TABLE || 'travelquest-comments',
  ADMIN_USERS: process.env.ADMIN_USERS_TABLE || 'travelquest-admin-users',
} as const;

// User Roles for Role-Based Access Control
export const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator', 
  EDITOR: 'editor',
  USER: 'user',
} as const;

// Role Hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY = [
  ROLES.USER,
  ROLES.EDITOR,
  ROLES.MODERATOR,
  ROLES.ADMIN,
] as const;

// API Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Entity Types
export const ENTITY_TYPES = {
  DESTINATION: 'destination',
  TOUR: 'tour',
  BLOG: 'blog',
  COMMENT: 'comment',
} as const;

// Comment Moderation Status
export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SPAM: 'spam',
} as const;

// Search and Pagination Defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Validation Constants
export const VALIDATION = {
  MAX_NAME_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 1000,
  MIN_PRICE: 0,
  MAX_PRICE: 999999,
  MIN_RATING: 0,
  MAX_RATING: 5,
} as const;

// Security Constants
export const SECURITY = {
  MAX_LOGIN_ATTEMPTS: 5,
  TOKEN_EXPIRY_HOURS: 24,
  RATE_LIMIT_REQUESTS_PER_MINUTE: 100,
} as const;

// Spam Detection Patterns
export const SPAM_PATTERNS = [
  /\b(buy now|click here|limited time|act now|free money)\b/gi,
  /(.)\1{4,}/g, // Repeated characters
  /(https?:\/\/[^\s]+)/g, // URLs (basic detection)
  /\b(viagra|casino|lottery|winner)\b/gi,
] as const;

export type TableName = typeof TABLE_NAMES[keyof typeof TABLE_NAMES];
export type Role = typeof ROLES[keyof typeof ROLES];
export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];
export type ModerationStatus = typeof MODERATION_STATUS[keyof typeof MODERATION_STATUS];
