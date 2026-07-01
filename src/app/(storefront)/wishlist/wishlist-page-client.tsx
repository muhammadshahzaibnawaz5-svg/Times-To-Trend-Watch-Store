'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/hooks/use-wishlist';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-16">
        {' '}
        <Breadcrumbs items={[{ label: 'Your Wishlist' }]} />{' '}
        <div className="mx-auto mt-12 max-w-md text-center">
          {' '}
          <div className="border-border bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full border">
            {' '}
            <Heart className="text-foreground h-8 w-8" />{' '}
          </div>{' '}
          <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
            Your Wishlist is Empty
          </h1>{' '}
          <p className="text-muted-foreground mt-3 text-base leading-7">
            {' '}
            Save your favorite watches and revisit them anytime. Start exploring our
            collection.{' '}
          </p>{' '}
          <div className="mt-8">
            {' '}
            <Button variant="default" size="lg" className="rounded-full px-10" asChild>
              <Link href="/products">Browse Collection</Link>
            </Button>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      {' '}
      <Breadcrumbs items={[{ label: 'Your Wishlist' }]} />{' '}
      <div className="bg-foreground mt-2 mb-2 h-1 w-16 rounded-full" />{' '}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {' '}
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {' '}
          Your Wishlist{' '}
          <span className="text-muted-foreground ml-2 text-lg font-normal">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>{' '}
        </h1>{' '}
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground rounded-full"
        >
          {' '}
          Clear All{' '}
        </Button>{' '}
      </div>{' '}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {' '}
        {items.map((item) => (
          <div
            key={item.productId}
            className="group border-border bg-card/80 hover:border-foreground/40 relative overflow-hidden rounded-md border shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 cursor-pointer"
          >
            {' '}
            <Link href={`/products/${item.slug}`}>
              {' '}
              <div className="bg-muted relative aspect-square overflow-hidden">
                {' '}
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                    className="img-premium object-cover transition-all duration-500 group-hover:scale-105"
                    unoptimized={item.image.startsWith('/')}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    {' '}
                    <Heart className="text-muted-foreground/30 h-8 w-8" />{' '}
                  </div>
                )}{' '}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />{' '}
              </div>{' '}
            </Link>{' '}
            <button
              onClick={() => removeItem(item.productId)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-black"
              aria-label={`Remove ${item.name} from wishlist`}
            >
              {' '}
              <Trash2 className="h-4 w-4" />{' '}
            </button>{' '}
            <div className="p-5">
              {' '}
              <Link href={`/products/${item.slug}`}>
                {' '}
                <h3 className="text-foreground hover:text-foreground line-clamp-1 font-medium transition-colors duration-200">
                  {' '}
                  {item.name}{' '}
                </h3>{' '}
              </Link>{' '}
              <p className="text-foreground mt-1 text-lg font-bold">
                {' '}
                {formatPrice(item.discountPrice ?? item.price)}{' '}
              </p>{' '}
              <div className="mt-4">
                {' '}
                <AddToCartButton
                  product={{
                    id: item.productId,
                    name: item.name,
                    slug: item.slug,
                    price: item.price,
                    discountPrice: item.discountPrice ?? null,
                    image: item.image || '',
                  }}
                />{' '}
              </div>{' '}
            </div>{' '}
          </div>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
