import { z } from 'zod';

const heroSettingsSchema = z.object({
  backgroundImage: z.string().optional(),
}).default({});

const countdownOfferSettingsSchema = z.object({
  targetDate: z.string().optional(),
}).default({});

const saleBannerSettingsSchema = z.object({
  backgroundImage: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
}).default({});

const productLimitSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
}).default({});

export const sectionSettingsSchemas = {
  hero: heroSettingsSchema,
  featured_products: productLimitSchema,
  new_arrivals: productLimitSchema,
  best_sellers: productLimitSchema,
  trending: productLimitSchema,
  discount_products: productLimitSchema,
  category_grid: heroSettingsSchema,
  sale_banner: saleBannerSettingsSchema,
  countdown_offer: countdownOfferSettingsSchema,
  newsletter: heroSettingsSchema,
  footer: heroSettingsSchema,
} as const;

export type SectionSettingsSchemaMap = typeof sectionSettingsSchemas;

export interface SettingsFormProps {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}
