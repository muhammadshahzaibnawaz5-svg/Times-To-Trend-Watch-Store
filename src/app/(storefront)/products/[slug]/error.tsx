'use client';

import { ErrorPage } from '@/components/shared/error-page';

export default function ProductDetailError({
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
      title="Product Error"
      message="We couldn't load the product details. Please try again."
    />
  );
}
