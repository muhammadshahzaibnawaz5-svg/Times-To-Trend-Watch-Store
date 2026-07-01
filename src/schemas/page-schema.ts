import { z } from 'zod';

const heroBlockSchema = z.object({
  id: z.string(),
  type: z.literal('hero'),
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string().optional(),
  backgroundImage: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
});

const textBlockSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  content: z.string().min(1, 'Content is required'),
});

const imageBlockSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  caption: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
});

const columnsBlockSchema = z.object({
  id: z.string(),
  type: z.literal('columns'),
  columns: z.number().int().min(2).max(3),
  columnContents: z.array(z.object({ content: z.string() })).min(2).max(3),
});

const ctaBlockSchema = z.object({
  id: z.string(),
  type: z.literal('cta'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().optional(),
  buttonLabel: z.string().min(1, 'Button label is required'),
  buttonUrl: z.string().min(1, 'Button URL is required'),
  backgroundColor: z.string().optional(),
});

const faqBlockSchema = z.object({
  id: z.string(),
  type: z.literal('faq'),
  items: z.array(
    z.object({
      question: z.string().min(1, 'Question is required'),
      answer: z.string().min(1, 'Answer is required'),
    }),
  ).min(1, 'At least one FAQ item is required'),
});

const contentBlockSchema = z.discriminatedUnion('type', [
  heroBlockSchema,
  textBlockSchema,
  imageBlockSchema,
  columnsBlockSchema,
  ctaBlockSchema,
  faqBlockSchema,
]);

export const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.array(contentBlockSchema).default([]),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  template: z.enum(['default', 'full_width', 'sidebar', 'landing']).default('default'),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const updatePageSchema = createPageSchema.partial();

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
