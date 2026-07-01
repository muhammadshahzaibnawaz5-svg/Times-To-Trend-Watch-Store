'use client';
import { ErrorPage } from '@/components/shared/error-page';
import { useEffect, useState } from 'react';
export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isDev, setIsDev] = useState(false);
  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
    console.error('[AdminDashboardError]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);
  if (isDev) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <div className="bg-destructive/10 text-destructive mb-4 rounded-lg border-2 border-destructive/30 p-6">
            <h1 className="mb-2 text-2xl font-bold">Admin Dashboard Error</h1>
            <p className="text-destructive/80 mb-4">
              An error occurred in the admin dashboard. Please try again.
            </p>
            <div className="bg-background rounded-md border p-4 font-mono text-sm">
              <p className="mb-1 font-semibold">Reference: {error.digest}</p>
              <p className="mb-2 font-semibold text-red-600">{error.message}</p>
              <pre className="text-foreground/80 overflow-auto whitespace-pre-wrap text-xs">
                {error.stack}
              </pre>
            </div>
          </div>
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      {' '}
      <ErrorPage
        error={error}
        reset={reset}
        title="Admin Dashboard Error"
        message="An error occurred in the admin dashboard. Please try again."
      />{' '}
    </div>
  );
}
