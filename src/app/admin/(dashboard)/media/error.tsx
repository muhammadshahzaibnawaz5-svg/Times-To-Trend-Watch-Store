'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function MediaError({
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
      title="Media Error"
      message="An error occurred while loading media."
    />
  );
}
