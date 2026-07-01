import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Order, OrderItem, OrderInsert, OrderItemInsert } from '@/types/order';
import type { ActionResult } from '@/types/common';
import { BaseRepository } from './base-repository';

export class OrderRepository extends BaseRepository<Order> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'orders');
  }

  async findByOrderNumber(orderNumber: string): Promise<ActionResult<Order>> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Order, error: null };
  }

  async findByUserId(userId: string): Promise<ActionResult<Order[]>> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data as Order[], error: null };
  }

  async createWithItems(
    order: OrderInsert,
    items: OrderItemInsert[],
  ): Promise<ActionResult<Order>> {
    const { data: newOrder, error: orderError } = await this.supabase
      .from('orders')
      .insert(order as any)
      .select()
      .single();

    if (orderError) return { data: null, error: orderError.message };

    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(
        items.map((item) => ({ ...item, order_id: newOrder.id })),
      );

    if (itemsError) return { data: null, error: itemsError.message };

    return { data: newOrder as Order, error: null };
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<ActionResult<Order>> {
    return this.update(id, { payment_status: paymentStatus } as any);
  }
}
