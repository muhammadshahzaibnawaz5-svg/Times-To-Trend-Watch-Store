'use client';
import { useEffect, useState } from 'react';
type CountdownOfferProps = { title?: string; subtitle?: string; targetDate?: string };
function CountdownTimer({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(target));
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);
  if (timeLeft.total <= 0) return null;
  return (
    <div className="flex justify-center gap-4">
      {' '}
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((unit) => (
        <div key={unit.label} className="bg-background/10 rounded-lg px-4 py-3 text-center">
          {' '}
          <div className="text-3xl font-bold">{String(unit.value).padStart(2, '0')}</div>{' '}
          <div className="text-background/70 text-xs">{unit.label}</div>{' '}
        </div>
      ))}{' '}
    </div>
  );
}
function getTimeRemaining(target: Date) {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}
export function CountdownOfferSection({ title, subtitle, targetDate }: CountdownOfferProps) {
  const target = targetDate ? new Date(targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return (
    <section className="bg-primary text-primary-foreground py-16">
      {' '}
      <div className="container mx-auto px-4 text-center">
        {' '}
        <h2 className="mb-4 text-3xl font-bold tracking-tight">
          {' '}
          {title || 'Flash Sale Ending Soon!'}{' '}
        </h2>{' '}
        {subtitle && <p className="text-primary-foreground/80 mb-8 text-lg">{subtitle}</p>}{' '}
        <CountdownTimer target={target} />{' '}
        <a
          href="/products"
          className="text-primary mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium shadow-lg transition-colors hover:bg-white/90"
        >
          {' '}
          Grab the Deal{' '}
        </a>{' '}
      </div>{' '}
    </section>
  );
}
