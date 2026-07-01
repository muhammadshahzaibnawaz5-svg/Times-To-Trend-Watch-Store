'use client';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logClientError } from '@/lib/error-logger';
type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
};
export function ErrorPage({
  error,
  reset,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
}: ErrorPageProps) {
  useEffect(() => {
    logClientError(error, { digest: error.digest, title });
  }, [error, title]);
  return (
    <div className="container mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      {' '}
      <div className="bg-destructive/10 text-destructive rounded-full p-4">
        {' '}
        <AlertTriangle className="h-10 w-10" />{' '}
      </div>{' '}
      <h1 className="mt-6 text-3xl font-bold">{title}</h1>{' '}
      <p className="text-muted-foreground mt-3">{message}</p>{' '}
      {error.digest && (
        <p className="text-muted-foreground mt-3 text-xs">Reference: {error.digest}</p>
      )}{' '}
      <Button onClick={reset} variant="outline" className="mt-6">
        {' '}
        Try Again{' '}
      </Button>{' '}
    </div>
  );
}
