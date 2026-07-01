'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function AdminProductsError({
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
      title="Admin Products Error"
      message="We couldn't load the products section. Please try again."
    />
  );
}
