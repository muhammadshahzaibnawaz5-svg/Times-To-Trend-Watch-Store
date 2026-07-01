'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecentlyViewedStore } from '@/store/recently-viewed-store';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
export function RecentlyViewed() {
  const items = useRecentlyViewedStore((s) => s.items);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);
  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    if (!card) return;
    const scrollAmount = card.offsetWidth + 16;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }, []);
  if (items.length === 0) return null;
  return (
    <div className="mt-16">
      {' '}
      <Separator className="bg-border/60 mb-12" />{' '}
      <div className="mb-8 flex items-center justify-between">
        {' '}
        <div>
          {' '}
          <p className="text-label text-muted-foreground inline-flex items-center gap-2">
            {' '}
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} /> Continue Browsing{' '}
          </p>{' '}
          <span className="section-rule mt-3" />{' '}
          <h2
            className="mt-4 text-2xl font-black tracking-tight md:text-3xl"
            style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
          >
            {' '}
            Recently Viewed{' '}
          </h2>{' '}
        </div>{' '}
        <div className="flex items-center gap-2">
          {' '}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="border-border bg-background/80 text-foreground/60 hover:border-foreground/20 hover:bg-background hover:text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Scroll left"
          >
            {' '}
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />{' '}
          </button>{' '}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="border-border bg-background/80 text-foreground/60 hover:border-foreground/20 hover:bg-background hover:text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Scroll right"
          >
            {' '}
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />{' '}
          </button>{' '}
        </div>{' '}
      </div>{' '}
      <div className="group relative">
        {' '}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="border-border bg-background/90 text-foreground/70 hover:bg-background hover:text-foreground absolute top-1/2 -left-3 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition-all duration-200"
            aria-label="Scroll left"
          >
            {' '}
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />{' '}
          </button>
        )}{' '}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="border-border bg-background/90 text-foreground/70 hover:bg-background hover:text-foreground absolute top-1/2 -right-3 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition-all duration-200"
            aria-label="Scroll right"
          >
            {' '}
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />{' '}
          </button>
        )}{' '}
        <div
          ref={scrollRef}
          className="-mx-4 flex [scrollbar-width:none] gap-4 overflow-x-auto px-4 [-ms-overflow-style:none] md:-mx-6 md:px-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {' '}
          {items.map((item) => {
            const imageUrl = item.image || '/images/New-watch.webp';
            return (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group w-[160px] shrink-0 md:w-[200px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                {' '}
                <div className="border-border/60 bg-card hover:border-foreground/20 overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                  {' '}
                  <div className="bg-muted relative aspect-square overflow-hidden">
                    {' '}
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      sizes="(min-width: 768px) 200px, 160px"
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />{' '}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />{' '}
                  </div>{' '}
                  <div className="p-3 md:p-4">
                    {' '}
                    {item.categoryName && (
                      <span className="text-muted-foreground text-[9px] font-bold tracking-[0.2em] uppercase">
                        {' '}
                        {item.categoryName}{' '}
                      </span>
                    )}{' '}
                    <h3 className="text-foreground mt-1 line-clamp-1 text-sm leading-snug font-medium tracking-tight">
                      {' '}
                      {item.name}{' '}
                    </h3>{' '}
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      {' '}
                      <span className="text-foreground text-sm font-bold tabular-nums">
                        {' '}
                        {formatPrice(item.discountPrice ?? item.price)}{' '}
                      </span>{' '}
                      {item.discountPrice && (
                        <span className="text-muted-foreground text-xs tabular-nums line-through">
                          {' '}
                          {formatPrice(item.price)}{' '}
                        </span>
                      )}{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </Link>
            );
          })}{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
