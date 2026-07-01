'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
type NewsletterProps = { title?: string; subtitle?: string };
export function NewsletterSection({ title, subtitle }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');
    if (!email) return;
    try {
      setSubmitting(true);
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);
      if (response.ok) {
        setStatus('success');
        setEmail('');
        toast.success('Thanks for subscribing!');
      } else {
        setStatus('error');
        toast.error(payload?.error || 'Subscription failed');
      }
    } catch {
      setStatus('error');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-24 text-white">
      {' '}
      {/* Subtle pattern */} <div className="bg-diagonal-lines absolute inset-0 opacity-80" />{' '}
      <div className="relative z-10 container mx-auto px-4">
        {' '}
        <div className="mx-auto max-w-2xl text-center">
          {' '}
          <p className="text-label text-white/35">Stay in the Loop</p>{' '}
          <h2
            className="mt-4 text-4xl leading-[1.15] font-light tracking-tight md:text-6xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {' '}
            {title || (
              <>
                {' '}
                Never Miss
                <br /> <em className="font-medium not-italic">a Drop.</em>{' '}
              </>
            )}{' '}
          </h2>{' '}
          {subtitle ? (
            <p className="mt-4 text-sm text-white/50">{subtitle}</p>
          ) : (
            <p className="mt-4 text-sm text-white/50">
              {' '}
              New arrivals, exclusive offers, and curated picks â€” delivered to your inbox.{' '}
            </p>
          )}{' '}
          <form onSubmit={handleSubmit} className="mt-10">
            {' '}
            <div className="flex items-stretch overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-all duration-300 focus-within:border-white/35">
              {' '}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-transparent px-5 py-4 text-sm text-white placeholder:text-white/35 focus:outline-none"
              />{' '}
              <button
                type="submit"
                disabled={submitting}
                className="group flex cursor-pointer items-center gap-2 border-l border-white/15 px-6 py-4 text-xs font-bold tracking-[0.2em] text-white/70 uppercase transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {' '}
                {submitting ? 'Sendingâ€¦' : 'Subscribe'}{' '}
                {!submitting && (
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                )}{' '}
              </button>{' '}
            </div>{' '}
            <p className="mt-4 text-[10px] text-white/25">
              {' '}
              No spam, ever. Unsubscribe at any time.{' '}
            </p>{' '}
          </form>{' '}
          {status === 'success' && (
            <p className="mt-6 text-xs font-semibold tracking-wide text-white/60 uppercase">
              {' '}
              âœ“ You're subscribed. Welcome aboard.{' '}
            </p>
          )}{' '}
          {status === 'error' && (
            <p className="mt-6 text-xs font-semibold tracking-wide text-white/60 uppercase">
              {' '}
              Something went wrong. Please try again.{' '}
            </p>
          )}{' '}
        </div>{' '}
      </div>{' '}
    </section>
  );
}
