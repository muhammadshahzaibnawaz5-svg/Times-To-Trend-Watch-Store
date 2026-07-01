import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address (e.g., name@domain.com)',
    ),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+92|0)[0-9]{10}$/,
      'Please enter a valid phone number (e.g., 03XXXXXXXXX or +923XXXXXXXXX)',
    ),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string(),
  productImage: z.string().optional().nullable(),
  variantLabel: z.string().optional().nullable(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  paymentMethod: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAmount: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
