'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/storefront/rating-stars';
import { QuantitySelector } from '@/components/storefront/quantity-selector';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCart } from '@/hooks/use-cart';

const FALLBACK_IMG = '/images/New-watch.webp';

type QuickViewProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  images: any;
  description?: string | null;
  categories?: { name: string; slug: string } | null;
};

type QuickViewModalProps = {
  product: QuickViewProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const modalImageUrl = product.images?.[0]?.url || FALLBACK_IMG;
  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    product.discount_price > 0;
  const displayPrice = hasDiscount ? product.discount_price! : product.price;
  const discountPercent =
    hasDiscount && product.price > 0
      ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
      : null;
  const { rating, count } = getProductRating(product.id);

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discount_price,
        image: modalImageUrl,
      });
    }
    onOpenChange(false);
    setQuantity(1);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border max-w-4xl gap-0 overflow-hidden rounded-lg p-0 shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
        <div className="grid grid-cols-2 max-h-[85vh] overflow-hidden">
          <div className="img-backdrop bg-muted relative min-h-full">
            <Image
              src={modalImageUrl}
              alt={product.name}
              fill
              className="img-premium object-cover"
              sizes="50vw"
              unoptimized
            />
          </div>

          <div className="flex max-h-[85vh] flex-col overflow-y-auto p-8">
            {product.categories && (
              <span className="border-border bg-muted/70 text-muted-foreground inline-flex w-fit items-center rounded-md border px-3 py-1 text-[11px] font-bold uppercase">
                {product.categories.name}
              </span>
            )}

            <h2 className="mt-4 text-2xl leading-tight font-semibold md:text-3xl">
              {product.name}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <RatingStars rating={rating} size="sm" />
              <span className="text-muted-foreground text-[11px] font-medium">({count})</span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-foreground text-2xl font-bold tabular-nums">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-muted-foreground text-sm tabular-nums line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-foreground text-background inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mt-4 text-sm leading-7">{product.description}</p>
            )}

            <div className="bg-border my-5 h-px" />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Material</span>
                <span className="text-foreground font-medium">Stainless Steel</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Strap</span>
                <span className="text-foreground font-medium">Premium Leather</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Movement</span>
                <span className="text-foreground font-medium">Automatic</span>
              </div>
            </div>

            <div className="bg-border my-5 h-px" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                onClick={handleAddToCart}
                className="flex-1 gap-2 rounded-md text-xs font-bold uppercase"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                Add to Cart
              </Button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={() => onOpenChange(false)}
              className="group text-muted-foreground hover:text-foreground mt-4 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase transition-colors"
            >
              View Full Details
              <Eye
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
