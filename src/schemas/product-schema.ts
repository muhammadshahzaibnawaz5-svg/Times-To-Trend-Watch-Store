import { z } from 'zod';

export const productImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().optional(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be non-negative'),
  discountPrice: z.number().nonnegative().optional().nullable(),
  sku: z.string().min(1, 'SKU is required'),
  stockQuantity: z.number().int().nonnegative().default(0),
  categoryId: z.string().uuid('Invalid category'),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const productFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  search: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  isFeatured: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
