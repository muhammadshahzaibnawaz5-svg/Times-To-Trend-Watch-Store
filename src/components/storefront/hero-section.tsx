'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
const HERO_SLIDES = [
  '/images/hero-banner.png',
  '/images/Hero-banners2.png',
  '/images/Hero-banner3.png',
];
type HeroSectionProps = {
  banner: {
    title?: string | null;
    subtitle?: string | null;
    button_text?: string | null;
    button_link?: string | null;
  } | null;
};
export function HeroSection({ banner }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);
  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);
  return (
    <section className="relative overflow-hidden border-b bg-black text-white">
      {' '}
      {HERO_SLIDES.map((src, index) => (
        <div
          key={src}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          {' '}
          <Image
            src={src}
            alt={`Hero banner ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />{' '}
        </div>
      ))}{' '}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />{' '}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />{' '}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 z-20 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-black"
      >
        {' '}
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />{' '}
      </button>{' '}
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 z-20 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-black"
      >
        {' '}
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />{' '}
      </button>{' '}
      <div className="absolute bottom-48 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {' '}
        {HERO_SLIDES.map((_, index) => (
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
        ))}{' '}
      </div>{' '}
      <div className="relative z-10 container mx-auto grid min-h-[50vh] md:min-h-[calc(100vh-6.5rem)] items-end gap-10 px-4 pb-28 md:pb-36 lg:grid-cols-[1.1fr_0.9fr]">
        {' '}
        <div className="animate-fade-up max-w-3xl">
          {' '}
          <p
            className="text-label animate-fade-in mb-4 text-white/40"
            style={{ animationDelay: '200ms' }}
          >
            {' '}
            {banner?.subtitle || 'Times to Trend'}{' '}
          </p>{' '}
          <h1
            className="text-5xl leading-[1.1] font-black tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "var(--font-league-spartan)" }}
          >
            {' '}
            {banner?.title || 'Watches that finish the look.'}{' '}
          </h1>{' '}
          <p
            className="animate-fade-in mt-4 max-w-lg text-sm leading-7 text-white/50"
            style={{ animationDelay: '300ms' }}
          >
            {' '}
            Curated timepieces for those who value precision, craftsmanship, and timeless
            design.{' '}
          </p>{' '}
          <div
            className="animate-fade-in mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '400ms' }}
          >
            {' '}
            <Link
              href={banner?.button_link || '/products'}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-white px-7 text-xs font-bold tracking-[0.18em] text-black uppercase transition-all duration-300 hover:bg-white/90"
            >
              {' '}
              {banner?.button_text || 'Shop Collection'}{' '}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{' '}
            </Link>{' '}
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-3 rounded-full border border-white/30 px-7 text-xs font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              {' '}
              Get Advice{' '}
            </Link>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white/40">
        {' '}
        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase">Scroll</span>{' '}
        <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />{' '}
      </div>{' '}
    </section>
  );
}
