import { z } from 'zod';

/**
 * Comment validation schemas
 */
export const CreateCommentSchema = z.object({
  destinationId: z.string().uuid('Invalid destination ID').optional(),
  tourId: z.string().uuid('Invalid tour ID').optional(),
  blogId: z.string().uuid('Invalid blog ID').optional(),
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment too long'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  userName: z.string().min(1, 'User name is required').max(100, 'User name too long'),
  userEmail: z.string().email('Invalid email format')
}).refine(
  data => data.destinationId || data.tourId || data.blogId,
  {
    message: 'Comment must be associated with a destination, tour, or blog',
    path: ['destinationId']
  }
);

export const UpdateCommentSchema = z.object({
  id: z.string().uuid('Invalid comment ID'),
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment too long').optional(),
  rating: z.number().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
  isSpam: z.boolean().optional(),
  moderatedBy: z.string().optional(),
  moderatedAt: z.string().datetime().optional(),
  rejectionReason: z.string().max(500).optional(),
  flagReason: z.string().max(500).optional()
});

export const CommentQuerySchema = z.object({
  destinationId: z.string().uuid().optional(),
  tourId: z.string().uuid().optional(),
  blogId: z.string().uuid().optional(),
  isApproved: z.string().transform(val => val === 'true').optional(),
  isSpam: z.string().transform(val => val === 'true').optional(),
  nextToken: z.string().optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default(20)
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
export type CommentQuery = z.infer<typeof CommentQuerySchema>;
