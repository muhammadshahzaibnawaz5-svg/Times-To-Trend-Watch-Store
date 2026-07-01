import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { PageHeader } from '@/components/admin/page-header';
import { OrdersTable } from './orders-table';
async function OrdersData() {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });
  return <OrdersTable orders={orders || []} />;
}
export default async function AdminOrdersPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader title="Orders" description="View and manage customer orders" />{' '}
      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        {' '}
        <OrdersData />{' '}
      </Suspense>{' '}
    </div>
  );
}
