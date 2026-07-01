'use client';
import { useEffect } from 'react';
import { useRecentlyViewedStore } from '@/store/recently-viewed-store';
type RecentlyViewedTrackerProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    image: string;
    categories: { name: string; slug: string } | null;
  };
};
export function RecentlyViewedTracker({ product }: RecentlyViewedTrackerProps) {
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);
  useEffect(() => {
    addProduct({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discount_price,
      image: product.image,
      categoryName: product.categories?.name ?? null,
      categorySlug: product.categories?.slug ?? null,
    });
  }, [product.id, addProduct]);
  return null;
}
