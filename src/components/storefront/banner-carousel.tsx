'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BANNER_SLIDES = [
  { src: '/images/Fotter-banner.png', alt: 'Luxury watch collection' },
  { src: '/images/Fotter-banner2.png', alt: 'Premium timepieces showcase' },
  { src: '/images/Fotter-banner3.png', alt: 'Elegant watch designs' },
];

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="bg-background relative overflow-hidden py-14 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-label text-muted-foreground">Curated Selection</p>
          <span className="section-rule mx-auto mt-3" />
          <h2 className="text-foreground mt-4 text-4xl leading-tight font-black md:text-5xl">
            Best Selling Collections
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-sm leading-7">
            Discover our most admired watch families, each piece selected for exceptional
            craftsmanship and timeless style.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="premium-panel bg-muted relative aspect-[21/9] overflow-hidden rounded-lg cursor-pointer transition-shadow duration-300 hover:shadow-lg">
            {BANNER_SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700 cursor-pointer',
                  index === current ? 'opacity-100' : 'opacity-0',
                )}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="border-border bg-background/90 text-muted-foreground hover:bg-foreground hover:text-background absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm backdrop-blur transition duration-200 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="border-border bg-background/90 text-muted-foreground hover:bg-foreground hover:text-background absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm backdrop-blur transition duration-200 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="absolute -bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {BANNER_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === current
                    ? 'bg-foreground w-8'
                    : 'bg-foreground/30 hover:bg-foreground/60 w-1.5',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
