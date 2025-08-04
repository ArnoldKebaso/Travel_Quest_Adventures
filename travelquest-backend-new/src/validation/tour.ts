import { z } from 'zod';

/**
 * Tour validation schemas
 */
export const CreateTourSchema = z.object({
  name: z.string().min(1, 'Tour name is required').max(200, 'Tour name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(3000, 'Description too long'),
  region: z.string().min(1, 'Region is required').max(100, 'Region too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country too long'),
  price: z.number().min(0, 'Price must be positive').max(100000, 'Price too high'),
  duration: z.number().min(1, 'Duration must be at least 1 day').max(365, 'Duration too long'),
  category: z.enum(['adventure', 'cultural', 'wildlife', 'culinary', 'luxury', 'budget', 'family']).default('adventure'),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'extreme']).default('moderate'),
  maxGroupSize: z.number().min(1, 'Group size must be at least 1').max(50, 'Group size too large').default(12),
  includes: z.array(z.string().max(200)).max(20, 'Too many inclusions').default([]),
  excludes: z.array(z.string().max(200)).max(20, 'Too many exclusions').default([]),
  itinerary: z.array(z.object({
    day: z.number().min(1),
    title: z.string().max(200),
    description: z.string().max(1000),
    activities: z.array(z.string().max(100)).default([])
  })).default([]),
  images: z.array(z.string().url('Invalid image URL')).max(10, 'Too many images').default([]),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0)
});

export const UpdateTourSchema = CreateTourSchema.partial().extend({
  id: z.string().uuid('Invalid tour ID')
});

export const TourQuerySchema = z.object({
  region: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  price_min: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0)).optional(),
  price_max: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0)).optional(),
  duration_min: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).optional(),
  duration_max: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).optional(),
  nextToken: z.string().optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default(20)
});

export type CreateTourInput = z.infer<typeof CreateTourSchema>;
export type UpdateTourInput = z.infer<typeof UpdateTourSchema>;
export type TourQuery = z.infer<typeof TourQuerySchema>;
