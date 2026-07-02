import { DollarSign, ShoppingCart } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';

export async function TodayStatsWidget() {
  const supabase = await createServerClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let todayOrders: { total_amount: unknown }[] = [];
  try {
    const result = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', todayStart.toISOString());
    todayOrders = (result.data as any[]) || [];
    console.log('[TodayStatsWidget] orders:', todayOrders.length);
  } catch (err) {
    console.error('[TodayStatsWidget] query failed:', err);
    todayOrders = [];
  }

  const totalRevenueToday = (todayOrders || []).reduce(
    (sum, order) => sum + (Number(order.total_amount) || 0),
    0,
  );
  const orderCountToday = todayOrders?.length || 0;

  return (
    <div className="bg-card rounded-lg border p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      <h3 className="mb-4 text-sm font-semibold">Today&apos;s Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md bg-blue-50 p-3 cursor-pointer transition-shadow duration-300 hover:shadow-md">
          <div className="flex items-center gap-2 text-blue-600">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-xs font-medium">Orders</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-blue-700">{orderCountToday}</p>
        </div>
        <div className="rounded-md bg-green-50 p-3 cursor-pointer transition-shadow duration-300 hover:shadow-md">
          <div className="flex items-center gap-2 text-green-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Revenue</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-green-700">
            ${totalRevenueToday.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
