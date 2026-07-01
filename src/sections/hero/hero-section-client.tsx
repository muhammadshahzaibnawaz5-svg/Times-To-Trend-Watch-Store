'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
}
interface HeroSectionClientProps {
  banners: Banner[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  backgroundImage?: string;
}
export function HeroSectionClient({
  banners,
  sectionTitle,
  sectionSubtitle,
  backgroundImage,
}: HeroSectionClientProps) {
  const fallbackBanners =
    sectionTitle || backgroundImage
      ? [
          {
            id: 'fallback',
            title: sectionTitle || null,
            subtitle: sectionSubtitle || null,
            image_url: backgroundImage || null,
            button_text: null,
            button_link: null,
            sort_order: 0,
          },
        ]
      : [];
  const slides = banners.length > 0 ? banners : fallbackBanners;
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
  const banner = slides[current];
  return (
    <section className="relative flex min-h-[50vh] md:min-h-[65vh] items-center justify-center overflow-hidden bg-black text-white">
      {' '}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          {' '}
          {slide.image_url && (
            <img
              src={slide.image_url}
              alt={slide.title || 'Hero banner'}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}{' '}
        </div>
      ))}{' '}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />{' '}
      <div className="bg-diagonal-lines absolute inset-0 opacity-40" />{' '}
      {slides.length > 1 && (
        <>
          {' '}
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
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {' '}
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
            ))}{' '}
          </div>{' '}
        </>
      )}{' '}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {' '}
        {banner && (
          <>
            {' '}
            <p className="text-label text-white/35">{banner.subtitle || 'Times to Trend'}</p>{' '}
            <h1
              className="mt-4 text-5xl leading-[1.1] font-light tracking-tight md:text-7xl"
              style={{ fontFamily: 'var(--font-league-spartan)' }}
            >
              {' '}
              {banner.title || sectionTitle}{' '}
            </h1>{' '}
            {banner.subtitle && (
              <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/60 md:text-base">
                {' '}
                {banner.subtitle}{' '}
              </p>
            )}{' '}
            {banner.button_text && banner.button_link && (
              <div className="mt-10">
                {' '}
                <Link
                  href={banner.button_link}
                  className="group inline-flex h-12 items-center gap-3 bg-white px-8 text-xs font-bold tracking-[0.18em] text-black uppercase transition-all duration-300 hover:bg-white/90"
                >
                  {' '}
                  {banner.button_text}{' '}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{' '}
                </Link>{' '}
              </div>
            )}{' '}
          </>
        )}{' '}
      </div>{' '}
    </section>
  );
}
