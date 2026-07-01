import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { SectionsTable } from './sections-table';
async function SectionsData() {
  const supabase = createAdminClient();
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('sort_order', { ascending: true });
  return <SectionsTable sections={sections || []} />;
}
export default async function AdminSectionsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Sections"
        description="Manage homepage section layout"
        actions={
          <Button asChild>
            <Link href="/admin/sections/new">
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Link>
          </Button>
        }
      />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <SectionsData />{' '}
      </Suspense>{' '}
    </div>
  );
}
