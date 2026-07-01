'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function SearchError({
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
      title="Search Error"
      message="We couldn't complete your search. Please try again."
    />
  );
}
