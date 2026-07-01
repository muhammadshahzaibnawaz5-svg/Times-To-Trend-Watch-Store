'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login as loginAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed. Please try again.');
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="bg-background relative flex min-h-screen overflow-hidden">
      {' '}
      {/* â”€â”€â”€ Background decoration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
      <div className="bg-dot-pattern pointer-events-none fixed inset-0 opacity-[0.15]" />{' '}
      <div className="from-foreground/[0.03] pointer-events-none fixed top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl" />{' '}
      {/* â”€â”€â”€ Left: Brand Panel (desktop) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
      <div className="relative hidden w-1/2 flex-col lg:flex">
        {' '}
        {/* Decorative background */}{' '}
        <div className="from-muted/50 via-background to-muted/30 absolute inset-0 bg-gradient-to-br" />{' '}
        <div className="from-foreground/[0.02] absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l to-transparent" />{' '}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          {' '}
          {/* Top */}{' '}
          <div>
            {' '}
            <div className="border-border bg-background/80 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase backdrop-blur-sm">
              {' '}
              <span className="bg-foreground h-1.5 w-1.5 rounded-full" /> Admin Portal{' '}
            </div>{' '}
          </div>{' '}
          {/* Center */}{' '}
          <div className="max-w-md">
            {' '}
            <div className="bg-foreground flex h-16 w-16 items-center justify-center rounded-2xl">
              {' '}
              <span
                className="text-background text-2xl font-bold tracking-tight"
                style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
              >
                {' '}
                TT{' '}
              </span>{' '}
            </div>{' '}
            <h1
              className="mt-8 text-4xl leading-[1.15] font-black tracking-tight"
              style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
            >
              {' '}
              Times to Trend{' '}
            </h1>{' '}
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {' '}
              Premium watch store management panel. Sign in to manage your inventory, process
              orders, and track your business performance.{' '}
            </p>{' '}
            <div className="bg-foreground/20 mt-8 h-px w-12" />{' '}
          </div>{' '}
          {/* Bottom */}{' '}
          <p className="text-muted-foreground text-xs">
            {' '}
            &copy; {new Date().getFullYear()} Times to Trend. All rights reserved.{' '}
          </p>{' '}
        </div>{' '}
      </div>{' '}
      {/* â”€â”€â”€ Right: Login Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        {' '}
        <div className="animate-fade-up w-full max-w-sm">
          {' '}
          {/* â”€â”€â”€ Mobile brand (visible on small screens) â”€â”€â”€â”€â”€â”€â”€ */}{' '}
          <div className="mb-10 text-center lg:hidden">
            {' '}
            <div className="border-border bg-muted/80 text-muted-foreground mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase">
              {' '}
              Admin Portal{' '}
            </div>{' '}
            <div className="bg-foreground mx-auto h-1 w-16 rounded-full" />{' '}
            <h1
              className="mt-4 text-3xl font-black tracking-tight"
              style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
            >
              {' '}
              Welcome back{' '}
            </h1>{' '}
          </div>{' '}
          {/* â”€â”€â”€ Form card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
          <div className="border-border bg-card/80 overflow-hidden rounded-xl border p-8 shadow-xl shadow-black/5 backdrop-blur-sm cursor-pointer transition-shadow duration-300 hover:shadow-2xl">
            {' '}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.02),transparent_50%)]" />{' '}
            <div className="relative z-10">
              {' '}
              <div className="border-border bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase">
                {' '}
                Sign In{' '}
              </div>{' '}
              <h2
                className="mt-4 text-2xl font-black tracking-tight"
                style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
              >
                {' '}
                Admin Login{' '}
              </h2>{' '}
              <p className="text-muted-foreground mt-1 text-sm">
                {' '}
                Enter your credentials to continue{' '}
              </p>{' '}
            </div>{' '}
            <div className="relative z-10 mt-8">
              {' '}
              <form onSubmit={handleSubmit} className="space-y-5">
                {' '}
                <div className="space-y-2">
                  {' '}
                  <Label
                    htmlFor="email"
                    className="text-foreground text-xs font-semibold tracking-wider uppercase"
                  >
                    {' '}
                    Email{' '}
                  </Label>{' '}
                  <div className="relative">
                    {' '}
                    <Mail
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                      strokeWidth={1.5}
                    />{' '}
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@timestotrend.com"
                      required
                      className="border-border bg-background/50 focus-visible:ring-ring pl-10 text-sm transition-all duration-200 focus-visible:ring-offset-0"
                    />{' '}
                  </div>{' '}
                </div>{' '}
                <div className="space-y-2">
                  {' '}
                  <Label
                    htmlFor="password"
                    className="text-foreground text-xs font-semibold tracking-wider uppercase"
                  >
                    {' '}
                    Password{' '}
                  </Label>{' '}
                  <div className="relative">
                    {' '}
                    <Lock
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                      strokeWidth={1.5}
                    />{' '}
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      required
                      className="border-border bg-background/50 focus-visible:ring-ring pl-10 text-sm transition-all duration-200 focus-visible:ring-offset-0"
                    />{' '}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {' '}
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      )}{' '}
                    </button>{' '}
                  </div>{' '}
                </div>{' '}
                {error && (
                  <div className="animate-slide-in-right border-border bg-muted/50 rounded-md border px-4 py-3">
                    {' '}
                    <p className="text-foreground text-xs">{error}</p>{' '}
                  </div>
                )}{' '}
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={pending}
                  className="group w-full rounded-full text-sm font-semibold"
                >
                  {' '}
                  {pending ? (
                    <span className="flex items-center gap-2">
                      {' '}
                      <span className="bg-primary-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full" />{' '}
                      <span
                        className="bg-primary-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ animationDelay: '200ms' }}
                      />{' '}
                      <span
                        className="bg-primary-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ animationDelay: '400ms' }}
                      />{' '}
                      Signing in{' '}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {' '}
                      Sign In{' '}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />{' '}
                    </span>
                  )}{' '}
                </Button>{' '}
              </form>{' '}
            </div>{' '}
          </div>{' '}
          {/* â”€â”€â”€ Mobile footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
          <p className="text-muted-foreground mt-8 text-center text-xs lg:hidden">
            {' '}
            &copy; {new Date().getFullYear()} Times to Trend. All rights reserved.{' '}
          </p>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
