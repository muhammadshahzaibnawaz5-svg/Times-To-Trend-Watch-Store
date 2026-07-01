import type { Metadata } from 'next';
import CheckoutPageClient from './checkout-page-client';
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Enter your shipping details and place your order securely.',
  alternates: { canonical: '/checkout' },
};
export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
