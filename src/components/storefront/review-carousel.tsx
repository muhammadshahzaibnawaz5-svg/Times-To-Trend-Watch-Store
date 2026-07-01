'use client';

import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const reviews = [
  {
    name: 'James Mitchell',
    rating: 5,
    text: 'Elegant design and excellent quality. The watch looks even better in real life, every detail exceeds expectations.',
  },
  {
    name: 'Sarah Al-Hassan',
    rating: 5,
    text: "Fast delivery and the piece was beautifully packaged. I've received more compliments on this watch than any other accessory I own.",
  },
  {
    name: 'David Chen',
    rating: 5,
    text: 'The craftsmanship speaks for itself. Wears comfortably all day and transitions seamlessly from office to evening.',
  },
  {
    name: 'Emily Brooks',
    rating: 5,
    text: "Customer service is genuinely helpful and the quality convinced me. I'm already planning my next purchase.",
  },
  {
    name: 'Marcus Rivera',
    rating: 5,
    text: 'Bought this as a gift and ended up ordering one for myself. The finishing is remarkable at this price point.',
  },
];

export function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-muted/25 border-y py-14 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="text-label text-muted-foreground">Testimonials</p>
          <span className="section-rule mx-auto mt-3" />
          <h2 className="text-foreground mt-4 text-4xl leading-tight font-black md:text-5xl">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-sm leading-7">
            Real stories from people who wear our timepieces every day.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous reviews"
            className="border-border bg-background text-muted-foreground hover:bg-foreground hover:text-background absolute top-1/2 -left-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm transition duration-200 md:flex cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next reviews"
            className="border-border bg-background text-muted-foreground hover:bg-foreground hover:text-background absolute top-1/2 -right-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border shadow-sm transition duration-200 md:flex cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div
            ref={scrollRef}
            className="flex [scrollbar-width:none] gap-6 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review) => (
              <div
                key={review.name}
                className="premium-panel hover:border-foreground/20 max-w-[400px] min-w-[300px] flex-shrink-0 rounded-lg p-7 transition duration-300 hover:-translate-y-0.5 sm:min-w-[340px] cursor-pointer"
              >
                <Quote className="text-foreground/12 h-8 w-8" strokeWidth={1} />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="fill-foreground text-foreground h-3.5 w-3.5"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mt-5 text-sm leading-7">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="border-border mt-6 flex items-center gap-3 border-t pt-5">
                  <div className="bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-md text-[11px] font-bold uppercase">
                    {review.name.charAt(0)}
                  </div>
                  <span className="text-foreground text-xs font-semibold uppercase">
                    {review.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
