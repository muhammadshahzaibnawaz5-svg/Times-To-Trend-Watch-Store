'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function CartError({
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
      title="Cart Error"
      message="We couldn't load your cart right now. Please try again."
    />
  );
}
