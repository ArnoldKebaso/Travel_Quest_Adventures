/**
 * Centralized validation schemas export
 */
export * from './destination';
export * from './comment';
export * from './tour';
export * from './blog';

import { z } from 'zod';

/**
 * Common validation utilities
 */
export const PaginationSchema = z.object({
  nextToken: z.string().optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default(20)
});

export const IdParamSchema = z.object({
  id: z.string().uuid('Invalid ID format')
});

export const ModerationActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'spam']),
  reason: z.string().max(500, 'Reason too long').optional()
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
export type ModerationAction = z.infer<typeof ModerationActionSchema>;
