'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function PagesError({
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
      title="Pages Error"
      message="An error occurred while loading pages."
    />
  );
}
