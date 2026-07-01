import Stripe from 'stripe';
import { validateEnv } from './env';

let stripeInstance: Stripe | null = null;

const env = validateEnv();

export function getStripe(): Stripe | null {
  if (stripeInstance) return stripeInstance;

  const secretKey = env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  stripeInstance = new Stripe(secretKey);

  return stripeInstance;
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  orderId: string,
): Promise<{ clientSecret: string; paymentIntentId: string } | { error: string }> {
  const stripe = getStripe();

  if (!stripe) {
    return {
      clientSecret: `sim_secret_${Date.now()}`,
      paymentIntentId: `sim_pi_${Date.now()}`,
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    if (!paymentIntent.client_secret) {
      return { error: 'Failed to create payment intent: no client secret returned' };
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error creating payment intent';
    return { error: message };
  }
}
