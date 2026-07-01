import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createOrderSchema } from '@/schemas/order-schema';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const orderPayload = {
      order_number: generateOrderNumber(),
      user_id: user.id,
      payment_method: parsed.data.paymentMethod,
      shipping_address: parsed.data.shippingAddress,
      billing_address: parsed.data.billingAddress || null,
      shipping_amount: parsed.data.shippingAmount,
      discount_amount: parsed.data.discountAmount,
      notes: parsed.data.notes || null,
      total_amount:
        parsed.data.items.reduce((sum, item) => sum + item.totalPrice, 0) +
        parsed.data.shippingAmount -
        parsed.data.discountAmount,
    };

    const { data, error } = await supabase.from('orders').insert(orderPayload).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
