import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      {' '}
      <p className="text-label text-muted-foreground">Error 404</p>{' '}
      <h1
        className="mt-4 text-6xl font-black tracking-tight md:text-8xl"
        style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
      >
        {' '}
        Not Found{' '}
      </h1>{' '}
      <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-7">
        {' '}
        The page you are looking for does not exist or may have been moved.{' '}
      </p>{' '}
      <Link
        href="/"
        className="group border-foreground hover:bg-foreground hover:text-background mt-10 inline-flex items-center gap-2.5 rounded-full border px-7 py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
      >
        {' '}
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />{' '}
        Back to Home{' '}
      </Link>{' '}
    </div>
  );
}
