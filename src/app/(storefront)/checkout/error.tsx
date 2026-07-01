'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function CheckoutError({
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
      title="Checkout Error"
      message="We couldn't load the checkout experience. Please try again."
    />
  );
}
