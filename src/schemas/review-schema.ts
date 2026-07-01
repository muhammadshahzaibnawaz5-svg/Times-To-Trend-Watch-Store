import { z } from 'zod';

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(500).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
