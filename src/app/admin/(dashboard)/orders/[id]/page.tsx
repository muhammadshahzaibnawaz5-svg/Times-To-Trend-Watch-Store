import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { OrderDetail } from './order-detail';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles(full_name, email, phone)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  return <OrderDetail order={order} />;
}
