import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { CategoriesTable } from './categories-table';
import { requireAdmin } from '@/components/admin/require-admin';
import { CategoryService } from '@/services/category-service';
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}
async function CategoriesData({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  let result;
  try {
    result = await service.getAllAdmin({ page: page ? Number(page) : 1, pageSize: 20 });
    console.log('[CategoriesData] categories count:', result.count);
  } catch (err) {
    console.error('[CategoriesData] query failed:', err);
    result = { data: [], count: 0, page: 1, pageSize: 20, totalPages: 0 };
  }
  return (
    <CategoriesTable
      categories={(result.data ?? []) as any}
      total={result.count ?? 0}
      page={result.page ?? 1}
      pageSize={result.pageSize ?? 20}
    />
  );
}
export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
        actions={
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Link>
          </Button>
        }
      />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <CategoriesData searchParams={searchParams} />{' '}
      </Suspense>{' '}
    </div>
  );
}
