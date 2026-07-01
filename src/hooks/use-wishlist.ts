'use client';

import { useWishlistStore, type WishlistItem } from '@/store/wishlist-store';

export function useWishlist() {
  const items = useWishlistStore((s) => s.items);
  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  return { items, addItem, removeItem, isInWishlist, clearWishlist };
}
