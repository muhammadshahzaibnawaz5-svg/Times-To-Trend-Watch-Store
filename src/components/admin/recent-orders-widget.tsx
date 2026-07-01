import { createServerClient } from '@/lib/supabase/server';
export async function RecentOrdersWidget() {
  const supabase = await createServerClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        {' '}
        <h3 className="mb-4 text-sm font-semibold">Recent Orders</h3>{' '}
        <p className="text-muted-foreground text-sm">No orders yet.</p>{' '}
      </div>
    );
  }
  return (
    <div className="bg-card rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {' '}
      <div className="border-b px-6 py-4">
        {' '}
        <h3 className="text-sm font-semibold">Recent Orders</h3>{' '}
      </div>{' '}
      <div className="divide-y">
        {' '}
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between px-6 py-3 text-sm">
            {' '}
            <div>
              {' '}
              <p className="font-medium">{order.order_number}</p>{' '}
              <p className="text-muted-foreground text-xs">
                {' '}
                {new Date(order.created_at).toLocaleDateString()}{' '}
              </p>{' '}
            </div>{' '}
            <div className="text-right">
              {' '}
              <p className="font-medium">${(Number(order.total_amount) || 0).toFixed(2)}</p>{' '}
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 capitalize">
                {' '}
                {order.status}{' '}
              </span>{' '}
            </div>{' '}
          </div>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
