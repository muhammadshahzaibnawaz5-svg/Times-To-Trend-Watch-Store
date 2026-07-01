'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function AdminOrdersError({
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
      title="Orders Error"
      message="We couldn't load the orders section. Please try again."
    />
  );
}
