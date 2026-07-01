'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/storefront/rating-stars';
import { WishlistButton } from './wishlist-button';
import { useCart } from '@/hooks/use-cart';
import { QuickViewModal } from './quick-view-modal';

const FALLBACK_IMG = '/images/New-watch.webp';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    images: any;
    status: string;
    categories?: { name: string; slug: string } | null;
  };
  priority?: boolean;
};

function getProductRating(id: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const base = 3.5 + (Math.abs(hash) % 15) / 10;
  const rating = Math.round(base * 2) / 2;
  const count = 20 + (Math.abs(hash) % 981);
  return { rating, count };
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem } = useCart();

  const imagesArr = Array.isArray(product.images) ? product.images : [];
  const imageUrl: string = imagesArr[0]?.url || FALLBACK_IMG;
  const secondaryImageUrl: string = imagesArr[1]?.url || imageUrl;
  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    product.discount_price > 0;
  const displayPrice = hasDiscount ? product.discount_price! : product.price;
  const category = product.categories;
  const { rating, count } = getProductRating(product.id);
  const discountPercent =
    hasDiscount && product.price > 0
      ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
      : null;

  return (
    <div className="group border-border/80 bg-card hover:border-foreground/25 relative flex h-full flex-col overflow-hidden rounded-lg border shadow-[0_12px_34px_rgba(0,0,0,0.045)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.09)] cursor-pointer">
      <div className="img-backdrop bg-muted relative aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="img-premium object-cover transition duration-700 group-hover:scale-[1.035] group-hover:opacity-0"
            priority={priority}
            unoptimized
          />
          <Image
            src={secondaryImageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="img-premium absolute inset-0 object-cover opacity-0 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100"
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {hasDiscount && discountPercent && (
          <div className="bg-foreground text-background absolute top-3 left-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-semibold shadow-sm">
            -{discountPercent}%
          </div>
        )}

        <button
          type="button"
          onClick={() => setQuickViewOpen(true)}
          className="absolute inset-x-3 bottom-3 z-10 cursor-pointer rounded-md border border-white/20 bg-black/80 px-4 py-3 text-center text-[11px] font-semibold text-white shadow-lg backdrop-blur transition duration-300 hover:bg-black md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Quick View
        </button>
      </div>

      <div className="absolute top-3 right-3 z-20">
        <WishlistButton product={product} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        {category && (
          <Link href={`/categories/${category.slug}`} className="inline-flex w-fit">
            <span className="border-border bg-muted/70 text-muted-foreground hover:border-foreground/25 hover:text-foreground rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors">
              {category.name}
            </span>
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-foreground group-hover:text-foreground/75 line-clamp-2 min-h-[2.75rem] text-[15px] leading-snug font-semibold transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <RatingStars rating={rating} size="sm" />
          <span className="text-muted-foreground text-[11px] font-medium">({count})</span>
        </div>

        <div className="mt-auto flex items-baseline gap-2.5">
          <span className="text-foreground text-lg font-bold tabular-nums">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-muted-foreground text-xs tabular-nums line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Button
          onClick={() =>
            addItem({
              id: product.id,
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              discountPrice: product.discount_price,
              image: imageUrl,
            })
          }
          variant="outline"
          size="sm"
          className="border-foreground/20 hover:bg-foreground hover:text-background mt-1 w-full gap-2 rounded-md text-xs font-semibold transition duration-200"
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
          Add to Cart
        </Button>
      </div>

      <QuickViewModal product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}
