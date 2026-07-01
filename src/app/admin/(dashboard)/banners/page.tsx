import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { BannersTable } from './banners-table';
import { requireAdmin } from '@/components/admin/require-admin';
async function BannersData() {
  const supabase = createAdminClient();
  const { data: banners } = await supabase
    .from('banners')
    .select('id, image_url')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  return <BannersTable banners={banners || []} />;
}
export default async function AdminBannersPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Hero Banners"
        description="Upload or delete background images for the homepage hero section. The slides autoscroll on the storefront."
        actions={
          <Button asChild>
            <Link href="/admin/banners/new">
              <Plus className="mr-2 h-4 w-4" /> Add Banner Image
            </Link>
          </Button>
        }
      />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <BannersData />{' '}
      </Suspense>{' '}
    </div>
  );
}
