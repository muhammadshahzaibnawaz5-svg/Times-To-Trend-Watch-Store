'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function MenusError({
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
      title="Menus Error"
      message="An error occurred while loading menus."
    />
  );
}
