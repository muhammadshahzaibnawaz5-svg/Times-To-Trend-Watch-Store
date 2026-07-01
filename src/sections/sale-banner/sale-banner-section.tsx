import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
type SaleBannerProps = { title?: string; subtitle?: string; backgroundImage?: string };
export function SaleBannerSection({ title, subtitle, backgroundImage }: SaleBannerProps) {
  return (
    <section className="relative overflow-hidden">
      {' '}
      {backgroundImage ? (
        <div className="absolute inset-0">
          {' '}
          <img src={backgroundImage} alt="" className="h-full w-full object-cover" />{' '}
          <div className="absolute inset-0 bg-black/80" />{' '}
        </div>
      ) : (
        <>
          {' '}
          <div className="absolute inset-0 bg-black" />{' '}
          <div className="bg-diagonal-lines absolute inset-0 opacity-100" />{' '}
        </>
      )}{' '}
      <div className="relative z-10 container mx-auto px-4 py-14 md:py-20 text-center text-white">
        {' '}
        <p className="text-label text-white/35">Limited Time</p>{' '}
        <h2
          className="mt-4 text-4xl leading-[1.15] font-light tracking-tight md:text-6xl"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {' '}
          {title || 'Exclusive Sale'}{' '}
        </h2>{' '}
        {subtitle && <p className="mx-auto mt-4 max-w-lg text-sm text-white/55">{subtitle}</p>}{' '}
        <div className="mt-10">
          {' '}
          <Link
            href="/products"
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-white px-8 text-xs font-bold tracking-[0.18em] text-black uppercase transition-all duration-300 hover:bg-white/90"
          >
            {' '}
            Shop Now{' '}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{' '}
          </Link>{' '}
        </div>{' '}
      </div>{' '}
    </section>
  );
}
