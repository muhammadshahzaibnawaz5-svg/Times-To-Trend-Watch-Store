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
      name: error.name,
      cause: error.cause,
    });
  }, [error]);

  if (isDev) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="bg-destructive/10 text-destructive mb-4 rounded-lg border-2 border-destructive/30 p-6">
            <h1 className="mb-2 text-2xl font-bold">Admin Dashboard Error</h1>
            <p className="text-destructive/80 mb-4">
              An error occurred in the admin dashboard.
            </p>

            {/* Reference */}
            <div className="bg-background rounded-md border p-4 font-mono text-sm">
              <p className="mb-1 font-semibold">Reference: {error.digest || 'N/A'}</p>
            </div>

            {/* Error Name & Message */}
            <div className="bg-background mt-3 rounded-md border p-4 font-mono text-sm">
              <p className="mb-1 font-semibold text-red-600">{error.name}</p>
              <p className="text-foreground/90">{error.message}</p>
            </div>

            {/* Full Stack Trace */}
            {error.stack && (
              <div className="bg-background mt-3 rounded-md border p-4">
                <p className="mb-2 text-sm font-semibold">Stack Trace:</p>
                <pre className="text-foreground/80 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">
                  {error.stack}
                </pre>
              </div>
            )}

            {/* Error Cause (if any) */}
            {error.cause ? (
              <div className="bg-background mt-3 rounded-md border border-amber-300 p-4">
                <p className="mb-2 text-sm font-semibold text-amber-700">Caused by:</p>
                <pre className="text-foreground/80 overflow-auto whitespace-pre-wrap text-xs">
                  {typeof error.cause === 'object' && error.cause !== null
                    ? (typeof (error.cause as Error).stack === 'string'
                        ? (error.cause as Error).stack ?? ''
                        : JSON.stringify(error.cause, null, 2))
                    : String(error.cause)}
                </pre>
              </div>
            ) : null}
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ErrorPage
        error={error}
        reset={reset}
        title="Admin Dashboard Error"
        message="An error occurred in the admin dashboard. Please try again."
      />
    </div>
  );
}
