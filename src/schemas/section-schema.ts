import { z } from 'zod';

export const sectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum([
    'hero',
    'featured_products',
    'new_arrivals',
    'best_sellers',
    'trending',
    'discount_products',
    'category_grid',
    'sale_banner',
    'countdown_offer',
    'newsletter',
    'footer',
  ]),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  settings: z.record(z.unknown()).default({}),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type SectionInput = z.infer<typeof sectionSchema>;
