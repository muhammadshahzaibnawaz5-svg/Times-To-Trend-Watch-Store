'use client';

import { ErrorPage } from '@/components/shared/error-page';

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Category Error"
      message="We couldn't load this category. Please try again."
    />
  );
}
