import { z } from 'zod';

/**
 * Blog validation schemas
 */
export const CreateBlogSchema = z.object({
  title: z.string().min(1, 'Blog title is required').max(200, 'Title too long'),
  content: z.string().min(50, 'Content must be at least 50 characters').max(10000, 'Content too long'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  authorEmail: z.string().email('Invalid email format'),
  category: z.enum(['travel-tips', 'destination-guide', 'adventure', 'culture', 'food', 'photography', 'budget-travel']).default('travel-tips'),
  tags: z.array(z.string().max(50)).max(10, 'Too many tags').default([]),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  images: z.array(z.string().url('Invalid image URL')).max(20, 'Too many images').default([]),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  readingTime: z.number().min(1, 'Reading time must be at least 1 minute').default(5),
  seoTitle: z.string().max(60, 'SEO title too long').optional(),
  seoDescription: z.string().max(160, 'SEO description too long').optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format').optional()
});

export const UpdateBlogSchema = CreateBlogSchema.partial().extend({
  id: z.string().uuid('Invalid blog ID')
});

export const BlogQuerySchema = z.object({
  category: z.string().optional(),
  author: z.string().optional(),
  isPublished: z.string().transform(val => val === 'true').optional(),
  tags: z.string().optional(), // Comma-separated tags
  search: z.string().optional(), // Search in title and content
  nextToken: z.string().optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default(20)
});

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
export type BlogQuery = z.infer<typeof BlogQuerySchema>;
