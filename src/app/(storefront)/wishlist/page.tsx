import type { Metadata } from 'next';
import WishlistPageClient from './wishlist-page-client';
export const metadata: Metadata = {
  title: 'Your Wishlist',
  description: 'Save your favorite watches and revisit them anytime.',
  alternates: { canonical: '/wishlist' },
};
export default function WishlistPage() {
  return <WishlistPageClient />;
}
