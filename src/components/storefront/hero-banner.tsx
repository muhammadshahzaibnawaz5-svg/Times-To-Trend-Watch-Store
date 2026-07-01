'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerImage {
  id: string;
  image_url: string | null;
}

type HeroBannerProps = { banners: BannerImage[] };

const FALLBACK_SLIDES = [
  '/images/hero-banner.png',
  '/images/Hero-banners2.png',
  '/images/Hero-banner3.png',
];

export function HeroBanner({ banners }: HeroBannerProps) {
  const slides =
    banners.length > 0
      ? (banners.map((b) => b.image_url).filter(Boolean) as string[])
      : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, slides.length]);

  return (
    <section className="relative overflow-hidden border-b bg-black text-white">
      {slides.map((src, index) => (
        <div
          key={src}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 cursor-pointer',
            index === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={src}
            alt={`Hero banner ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/52 to-black/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute top-1/2 left-4 z-20 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/20 bg-black/45 text-white backdrop-blur transition duration-200 hover:bg-white hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute top-1/2 right-4 z-20 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/20 bg-black/45 text-white backdrop-blur transition duration-200 hover:bg-white hover:text-black"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                )}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 container mx-auto grid min-h-[50vh] md:min-h-[68vh] items-center px-4 py-16 md:min-h-[72vh] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up max-w-2xl">
          <p className="text-label text-white/60">Times to Trend</p>
          <h1
            className="mt-4 text-5xl leading-[1.02] text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-league-spartan)' }}
          >
            Premium Watches For You
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="group inline-flex h-12 items-center gap-3 rounded-md bg-white px-7 text-xs font-bold text-black uppercase transition duration-300 hover:bg-white/90"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-3 rounded-md border border-white/30 px-7 text-xs font-bold text-white uppercase backdrop-blur transition duration-300 hover:border-white hover:bg-white/10"
            >
              Get Advice
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white/45">
        <span className="text-[10px] font-semibold uppercase">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-white/35 to-transparent" />
      </div>
    </section>
  );
}
