import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Order, OrderInsert } from '@/types/order';
import type { ActionResult } from '@/types/common';
import { OrderRepository } from '@/repositories/order-repository';

export class OrderService {
  private repository: OrderRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new OrderRepository(supabase);
  }

  async getAll(options?: {
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<ActionResult<Order[]>> {
    return this.repository.findAll({
      columns: '*, profiles(full_name, email)',
      orderBy: options?.orderBy || { column: 'created_at', ascending: false },
    });
  }

  async getById(id: string): Promise<ActionResult<Order>> {
    return this.repository.findById(id);
  }

  async create(order: OrderInsert, items: any[]): Promise<ActionResult<Order>> {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const calculatedTotal = totalAmount + (order.shipping_amount || 0) - (order.discount_amount || 0);

    if (Math.abs(calculatedTotal - order.total_amount) > 0.01) {
      return { data: null, error: 'Order total does not match line items' };
    }

    return this.repository.createWithItems(order, items);
  }

  async getByUser(userId: string): Promise<ActionResult<Order[]>> {
    return this.repository.findByUserId(userId);
  }

  async getByOrderNumber(orderNumber: string): Promise<ActionResult<Order>> {
    return this.repository.findByOrderNumber(orderNumber);
  }

  async updateStatus(id: string, status: string, notes?: string): Promise<ActionResult<Order>> {
    const update: Record<string, unknown> = { status };
    if (notes !== undefined) update.notes = notes;
    return this.repository.update(id, update as any);
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<ActionResult<Order>> {
    return this.repository.updatePaymentStatus(id, paymentStatus);
  }

  async markHalfPaymentDelivered(id: string, totalAmount: number): Promise<ActionResult<Order>> {
    return this.repository.update(id, {
      payment_status: 'paid',
      paid_amount: totalAmount,
    } as any);
  }
}
