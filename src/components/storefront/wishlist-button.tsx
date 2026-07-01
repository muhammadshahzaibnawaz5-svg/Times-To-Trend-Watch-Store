'use client';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
type WishlistButtonProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    images: any;
  };
  variant?: 'icon' | 'full';
  className?: string;
};
export function WishlistButton({ product, variant = 'icon', className }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const images = Array.isArray(product.images) ? product.images : [];
  const imageUrl = images[0]?.url || '';
  const inWishlist = isInWishlist(product.id);
  const handleToggle = () => {
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: imageUrl,
        price: product.price,
        discountPrice: product.discount_price,
      });
    }
  };
  if (variant === 'full') {
    return (
      <Button variant="outline" onClick={handleToggle} className={cn('gap-2', className)}>
        {' '}
        <Heart className={cn('h-4 w-4', inWishlist && 'fill-foreground text-foreground')} />{' '}
        {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}{' '}
      </Button>
    );
  }
  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        'hover:border-foreground/40 hover:bg-background flex h-10 w-10 min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md border border-white/25 bg-white/85 shadow-sm backdrop-blur-sm transition duration-200',
        inWishlist && 'border-foreground/30 bg-background',
        className,
      )}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {' '}
      <Heart
        className={cn(
          'h-3.5 w-3.5 transition-all duration-200',
          inWishlist
            ? 'fill-foreground text-foreground'
            : 'text-foreground/60 hover:text-foreground',
        )}
        strokeWidth={1.75}
      />{' '}
    </button>
  );
}
