import { z } from 'zod';

/**
 * Destination validation schemas
 */
export const CreateDestinationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  region: z.string().min(1, 'Region is required').max(100, 'Region too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country too long'),
  price: z.number().min(0, 'Price must be positive').max(50000, 'Price too high'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  category: z.enum(['adventure', 'cultural', 'relaxation', 'nature', 'city', 'beach', 'mountain']).default('adventure'),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
  highlights: z.array(z.string().max(100)).max(10, 'Too many highlights').default([])
});

export const UpdateDestinationSchema = CreateDestinationSchema.partial().extend({
  id: z.string().uuid('Invalid destination ID')
});

export const DestinationQuerySchema = z.object({
  region: z.string().optional(),
  category: z.string().optional(),
  price_min: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0)).optional(),
  price_max: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0)).optional(),
  nextToken: z.string().optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default(20)
});

export type CreateDestinationInput = z.infer<typeof CreateDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof UpdateDestinationSchema>;
export type DestinationQuery = z.infer<typeof DestinationQuerySchema>;
