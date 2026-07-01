'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function ProductsError({
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
      title="Products Error"
      message="We couldn't load the products. Please try again."
    />
  );
}
