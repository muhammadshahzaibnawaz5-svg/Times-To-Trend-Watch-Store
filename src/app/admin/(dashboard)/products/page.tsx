import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { ProductsTable } from './products-table';
import { requireAdmin } from '@/components/admin/require-admin';
import { ProductService } from '@/services/product-service';
interface PageProps {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string }>;
}
async function ProductsData({ searchParams }: PageProps) {
  const { page, pageSize, search, status } = await searchParams;
  const supabase = await createServerClient();
  const service = new ProductService(supabase);
  const result = await service.getAllAdmin({
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 20,
    search,
    status,
  });
  return (
    <ProductsTable
      products={(result.data ?? []) as any}
      total={result.count ?? 0}
      page={result.page ?? 1}
      pageSize={result.pageSize ?? 20}
      search={search ?? ''}
      status={status ?? ''}
    />
  );
}
export default async function AdminProductsPage({ searchParams }: PageProps) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        }
      />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <ProductsData searchParams={searchParams} />{' '}
      </Suspense>{' '}
    </div>
  );
}
