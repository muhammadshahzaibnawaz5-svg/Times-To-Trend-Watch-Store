import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { PagesTable } from './pages-table';
import { requireAdmin } from '@/components/admin/require-admin';
import { PageService } from '@/services/page-service';
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}
async function PagesData({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const supabase = await createServerClient();
  const service = new PageService(supabase);
  const result = await service.getAllAdmin(page ? Number(page) : 1, 20);
  return (
    <PagesTable
      pages={(result.data ?? []) as any}
      total={result.count ?? 0}
      page={result.page ?? 1}
      pageSize={result.pageSize ?? 20}
    />
  );
}
export default async function AdminPagesPage({ searchParams }: PageProps) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Pages"
        description="Create and manage custom pages for your store"
        actions={
          <Button asChild>
            <Link href="/admin/pages/new">
              <Plus className="mr-2 h-4 w-4" /> Add Page
            </Link>
          </Button>
        }
      />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <PagesData searchParams={searchParams} />{' '}
      </Suspense>{' '}
    </div>
  );
}
