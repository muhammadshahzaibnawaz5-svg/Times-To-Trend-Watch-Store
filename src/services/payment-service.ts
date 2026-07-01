import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Order } from '@/types/order';
import type { ActionResult } from '@/types/common';
import type { StripePaymentInput, EasypaisaPaymentInput, JazzCashPaymentInput, HalfPaymentInput } from '@/schemas/payment-schema';
import { OrderRepository } from '@/repositories/order-repository';
import { createPaymentIntent } from '@/lib/stripe';
import { STORE_PAYMENT_ACCOUNT } from '@/constants/store';

export interface PaymentResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  paymentIntentId?: string;
  screenshotUrl?: string;
  paidAmount?: number;
  accountNumber?: string;
}

export class PaymentService {
  private supabase: SupabaseClient<Database>;
  private orderRepo: OrderRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
    this.orderRepo = new OrderRepository(supabase);
  }

  async processPayment(
    orderId: string,
    paymentMethod: string,
    paymentDetails: Record<string, unknown>,
  ): Promise<PaymentResult> {
    switch (paymentMethod) {
      case 'stripe':
        return this.processStripePayment(orderId, paymentDetails as unknown as StripePaymentInput);
      case 'easypaisa':
        return this.processEasypaisaPayment(orderId, paymentDetails as unknown as EasypaisaPaymentInput);
      case 'jazzcash':
        return this.processJazzCashPayment(orderId, paymentDetails as unknown as JazzCashPaymentInput);
      case 'half':
        return this.processHalfPayment(orderId, paymentDetails as unknown as HalfPaymentInput);
      default:
        return { success: false, error: `Unknown payment method: ${paymentMethod}` };
    }
  }

  private async processStripePayment(
    orderId: string,
    details: StripePaymentInput,
  ): Promise<PaymentResult> {
    return {
      success: true,
      paymentIntentId: details.paymentIntentId,
      screenshotUrl: details.paymentScreenshot,
    };
  }

  private async processEasypaisaPayment(
    orderId: string,
    details: EasypaisaPaymentInput,
  ): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: details.transactionId,
      screenshotUrl: details.paymentScreenshot,
      accountNumber: details.accountNumber,
    };
  }

  private async processJazzCashPayment(
    orderId: string,
    details: JazzCashPaymentInput,
  ): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: details.transactionId,
      screenshotUrl: details.paymentScreenshot,
      accountNumber: details.accountNumber,
    };
  }

  private async processHalfPayment(
    orderId: string,
    details: HalfPaymentInput,
  ): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: details.transactionId,
      screenshotUrl: details.paymentScreenshot,
      paidAmount: details.paidAmount,
      accountNumber: details.accountNumber,
    };
  }

  async confirmPayment(
    orderId: string,
    paymentMethod: string,
    paymentDetails: Record<string, unknown>,
  ): Promise<ActionResult<Order>> {
    const paymentResult = await this.processPayment(orderId, paymentMethod, paymentDetails);

    if (!paymentResult.success) {
      return { data: null, error: paymentResult.error || 'Payment failed' };
    }

    if (paymentResult.transactionId) {
      const { data: existing } = await this.supabase
        .from('orders')
        .select('id')
        .eq('transaction_id', paymentResult.transactionId)
        .maybeSingle();

      if (existing) {
        return { data: null, error: 'This transaction ID has already been used for another order' };
      }
    }

    const updateData: Record<string, unknown> = {
      payment_screenshot: paymentResult.screenshotUrl || null,
    };

    if (paymentResult.transactionId) {
      updateData.transaction_id = paymentResult.transactionId;
    }

    if (paymentResult.accountNumber) {
      updateData.account_number = paymentResult.accountNumber;
    }

    if (paymentMethod !== 'stripe') {
      updateData.payment_account_number = STORE_PAYMENT_ACCOUNT.number;
    }

    if (paymentMethod === 'half') {
      updateData.payment_status = 'half_paid';
      updateData.paid_amount = paymentResult.paidAmount;
    } else {
      updateData.payment_status = 'paid';
    }

    const result = await this.orderRepo.update(orderId, updateData as any);
    return result;
  }
}
