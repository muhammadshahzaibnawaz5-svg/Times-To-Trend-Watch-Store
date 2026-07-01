'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function CategoriesError({
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
      title="Admin Categories Error"
      message="We couldn't load the categories section. Please try again."
    />
  );
}
