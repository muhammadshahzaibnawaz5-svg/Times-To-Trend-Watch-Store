import { Suspense } from 'react';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          {' '}
          <div className="bg-muted h-9 w-48 animate-pulse rounded" />{' '}
          <div className="grid gap-4 md:grid-cols-4">
            {' '}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border p-6 shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
                {' '}
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />{' '}
                <div className="bg-muted mt-2 h-8 w-16 animate-pulse rounded" />{' '}
              </div>
            ))}{' '}
          </div>{' '}
        </div>
      }
    >
      {' '}
      <AdminDashboard />{' '}
    </Suspense>
  );
}
