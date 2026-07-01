'use client';
import { ErrorPage } from '@/components/shared/error-page';
export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {' '}
      <ErrorPage
        error={error}
        reset={reset}
        title="Admin Dashboard Error"
        message="An error occurred in the admin dashboard. Please try again."
      />{' '}
    </div>
  );
}
