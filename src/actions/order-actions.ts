'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { createOrderSchema, type CreateOrderInput } from '@/schemas/order-schema';
import { confirmPaymentSchema } from '@/schemas/payment-schema';
import { OrderService } from '@/services/order-service';
import { PaymentService } from '@/services/payment-service';
import { requireAdmin } from '@/components/admin/require-admin';
import { generateOrderNumber } from '@/lib/utils';
import type { ActionResult } from '@/types/common';
import type { Order } from '@/types/order';

export async function getAllOrders() {
  return createServiceAction(OrderService, 'getAll');
}

export async function getOrderById(id: string) {
  return createServiceAction(OrderService, 'getById', id);
}

const GUEST_USER_ID = '00000000-0000-0000-0000-000000000002';

async function ensureGuestProfile(supabase: Awaited<ReturnType<typeof createServerClient>>, name: string): Promise<string> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', GUEST_USER_ID)
    .maybeSingle();

  if (existing) return existing.id;

  await supabase.from('profiles').upsert({
    id: GUEST_USER_ID,
    email: `guest-${Date.now()}@guest.local`,
    full_name: name,
    role: 'customer',
  });

  return GUEST_USER_ID;
}

export async function checkoutAction(input: CreateOrderInput): Promise<ActionResult<Order>> {
  const supabase = await createServerClient();

  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const userId = await ensureGuestProfile(supabase, parsed.data.shippingAddress.fullName);

  const totalAmount = parsed.data.items.reduce((sum, item) => sum + item.totalPrice, 0)
    + parsed.data.shippingAmount
    - parsed.data.discountAmount;

  const service = new OrderService(supabase);
  const result = await service.create(
    {
      order_number: generateOrderNumber(),
      user_id: userId,
      total_amount: totalAmount,
      shipping_amount: parsed.data.shippingAmount,
      discount_amount: parsed.data.discountAmount,
      payment_method: parsed.data.paymentMethod,
      shipping_address: parsed.data.shippingAddress as any,
      billing_address: (parsed.data.billingAddress as any) || null,
      notes: parsed.data.notes || null,
    },
    parsed.data.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage || null,
      variant_label: item.variantLabel || null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    })),
  );

  if (!result.error) {
    revalidatePath('/admin/orders');
  }

  return result;
}

/** @deprecated Use checkoutAction directly with typed input instead */
export async function createOrder(formData: FormData): Promise<ActionResult<Order>> {
  try {
    const shippingAddress = JSON.parse(formData.get('shippingAddress') as string);
    const billingAddress = formData.get('billingAddress')
      ? JSON.parse(formData.get('billingAddress') as string)
      : undefined;
    const items = JSON.parse(formData.get('items') as string);
    return checkoutAction({
      shippingAddress,
      billingAddress,
      paymentMethod: String(formData.get('paymentMethod') || ''),
      notes: formData.get('notes') ? String(formData.get('notes')) : undefined,
      items,
      shippingAmount: Number(formData.get('shippingAmount')) || 0,
      discountAmount: Number(formData.get('discountAmount')) || 0,
    });
  } catch {
    return { data: null, error: 'Invalid form data format' };
  }
}

export async function createAndPayAction(
  checkoutInput: CreateOrderInput,
  paymentDetails: Record<string, unknown>,
): Promise<ActionResult<Order>> {
  const supabase = await createServerClient();

  const parsed = createOrderSchema.safeParse(checkoutInput);
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const paymentMethod = parsed.data.paymentMethod;
  const paymentParsed = confirmPaymentSchema.safeParse({ paymentMethod, paymentDetails });
  if (!paymentParsed.success) {
    return { data: null, error: paymentParsed.error.errors[0].message };
  }

  const userId = await ensureGuestProfile(supabase, parsed.data.shippingAddress.fullName);

  const totalAmount = parsed.data.items.reduce((sum, item) => sum + item.totalPrice, 0)
    + parsed.data.shippingAmount
    - parsed.data.discountAmount;

  const orderService = new OrderService(supabase);
  const orderResult = await orderService.create(
    {
      order_number: generateOrderNumber(),
      user_id: userId,
      total_amount: totalAmount,
      shipping_amount: parsed.data.shippingAmount,
      discount_amount: parsed.data.discountAmount,
      payment_method: paymentMethod,
      shipping_address: parsed.data.shippingAddress as any,
      billing_address: (parsed.data.billingAddress as any) || null,
      notes: parsed.data.notes || null,
    },
    parsed.data.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage || null,
      variant_label: item.variantLabel || null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    })),
  );

  if (orderResult.error) {
    return orderResult;
  }

  if (!orderResult.data) {
    return { data: null, error: 'Order could not be created' };
  }

  const paymentService = new PaymentService(supabase);
  const confirmResult = await paymentService.confirmPayment(
    orderResult.data.id,
    paymentMethod,
    paymentParsed.data.paymentDetails as unknown as Record<string, unknown>,
  );

  if (confirmResult.error) {
    return { data: null, error: confirmResult.error };
  }

  revalidatePath('/admin/orders');
  return confirmResult;
}

export async function getUserOrders() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  return createServiceAction(OrderService, 'getByUser', user.id);
}

export async function updateOrderStatus(
  id: string,
  status: string,
  notes?: string,
): Promise<ActionResult<Order>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new OrderService(supabase);
  const result = await service.updateStatus(id, status, notes);
  if (!result.error) revalidatePath('/admin/orders');
  return result;
}

export async function confirmPaymentAction(
  orderId: string,
  paymentMethod: string,
  paymentDetails: Record<string, unknown>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();

  const parsed = confirmPaymentSchema.safeParse({ paymentMethod, paymentDetails });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const paymentService = new PaymentService(supabase);
  const result = await paymentService.confirmPayment(orderId, paymentMethod, paymentDetails);

  if (result.error) {
    return { success: false, error: result.error };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: string,
): Promise<ActionResult<Order>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new OrderService(supabase);
  const result = await service.updatePaymentStatus(orderId, paymentStatus);
  if (!result.error) revalidatePath('/admin/orders');
  return result;
}

export async function markHalfPaymentDeliveredAction(
  orderId: string,
  totalAmount: number,
): Promise<ActionResult<Order>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new OrderService(supabase);
  const result = await service.markHalfPaymentDelivered(orderId, totalAmount);
  if (!result.error) revalidatePath('/admin/orders');
  return result;
}
