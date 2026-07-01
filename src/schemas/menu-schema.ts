import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const menuItemSchema: z.ZodLazy<z.ZodObject<{
  id: z.ZodString;
  label: z.ZodString;
  url: z.ZodString;
  children: z.ZodDefault<z.ZodArray<z.ZodLazy<any>>>;
}>> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string().min(1, 'Label is required'),
    url: z.string().min(1, 'URL is required'),
    children: z.array(menuItemSchema).default([]),
  }),
);

export type MenuItemInput = z.infer<typeof menuItemSchema>;

export const createMenuSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.enum(['header', 'footer', 'footer-bottom']),
  items: z.array(menuItemSchema).default([]),
});

export const updateMenuSchema = createMenuSchema.partial();

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
