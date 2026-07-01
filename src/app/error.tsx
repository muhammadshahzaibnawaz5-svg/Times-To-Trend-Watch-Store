'use client';
import { useEffect } from 'react';
import { ErrorPage } from '@/components/shared/error-page';
import { logClientError } from '@/lib/error-logger';
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logClientError(error, { scope: 'global-root' });
  }, [error]);
  return (
    <html>
      {' '}
      <body>
        {' '}
        <ErrorPage
          error={error}
          reset={reset}
          title="Application Error"
          message="Something unexpected happened while loading the application."
        />{' '}
      </body>{' '}
    </html>
  );
}
