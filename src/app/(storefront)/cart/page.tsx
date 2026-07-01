import type { Metadata } from 'next';
import CartPageClient from './cart-page-client';
export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review items in your cart before proceeding to checkout.',
  alternates: { canonical: '/cart' },
};
export default function CartPage() {
  return <CartPageClient />;
}
