import { z } from 'zod';

export const bannerSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
});

export type BannerInput = z.infer<typeof bannerSchema>;
