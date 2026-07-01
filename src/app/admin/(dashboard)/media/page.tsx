import { Suspense } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { requireAdmin } from '@/components/admin/require-admin';
import { MediaGrid } from './media-grid';
export default async function AdminMediaPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Media Library"
        description="Upload and manage images for your store"
      />{' '}
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4">
            {' '}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-muted aspect-square animate-pulse rounded-lg" />
            ))}{' '}
          </div>
        }
      >
        {' '}
        <MediaGrid />{' '}
      </Suspense>{' '}
    </div>
  );
}
