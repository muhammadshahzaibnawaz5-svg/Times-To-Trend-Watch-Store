import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { requireAdmin } from '@/components/admin/require-admin';
import { MenuService } from '@/services/menu-service';
import { MenusList } from './menus-list';
async function MenusData() {
  const supabase = await createServerClient();
  const service = new MenuService(supabase);
  const { data: menus } = await service.getAll();
  return <MenusList menus={(menus || []) as any} />;
}
export default async function AdminMenusPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader
        title="Menus"
        description="Manage navigation menus for your store"
        actions={
          <Button asChild>
            <Link href="/admin/menus/new">
              <Plus className="mr-2 h-4 w-4" /> Add Menu
            </Link>
          </Button>
        }
      />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <MenusData />{' '}
      </Suspense>{' '}
    </div>
  );
}
