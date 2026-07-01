import { Suspense } from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { ChartRevenue } from '@/components/admin/chart-revenue-dynamic';
import { RecentOrdersWidget } from '@/components/admin/recent-orders-widget';
import { QuickActionsWidget } from '@/components/admin/quick-actions-widget';
import { ContentOverviewWidget } from '@/components/admin/content-overview-widget';
import { LowStockWidget } from '@/components/admin/low-stock-widget';
import { TodayStatsWidget } from '@/components/admin/today-stats-widget';
import { createServerClient } from '@/lib/supabase/server';
export async function AdminDashboard() {
  const supabase = await createServerClient();
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  const { count: customerCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');
  const { data: revenueData } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .eq('payment_status', 'paid')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true });
  const revenueByDate = (revenueData || []).reduce<Record<string, number>>((acc, order) => {
    const date = new Date(order.created_at ?? Date.now()).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + (Number(order.total_amount) || 0);
    return acc;
  }, {});
  const chartData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const totalRevenue = (revenueData || []).reduce(
    (sum, order) => sum + (Number(order.total_amount) || 0),
    0,
  );
  return (
    <div className="space-y-8">
      {' '}
      <h1 className="text-3xl font-bold">Dashboard</h1> {/* Stat Cards Row */}{' '}
      <div className="grid gap-4 md:grid-cols-4">
        {' '}
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4" />}
        />{' '}
        <StatCard
          label="Total Orders"
          value={orderCount ?? 0}
          icon={<ShoppingCart className="h-4 w-4" />}
        />{' '}
        <StatCard
          label="Total Products"
          value={productCount ?? 0}
          icon={<Package className="h-4 w-4" />}
        />{' '}
        <StatCard
          label="Total Customers"
          value={customerCount ?? 0}
          icon={<Users className="h-4 w-4" />}
        />{' '}
      </div>{' '}
      {/* Two-column layout: Chart + Right sidebar */}{' '}
      <div className="grid gap-6 lg:grid-cols-3">
        {' '}
        <div className="lg:col-span-2">
          {' '}
          <ChartRevenue data={chartData} />{' '}
        </div>{' '}
        <div className="space-y-4">
          {' '}
          <Suspense fallback={<div className="bg-muted h-40 animate-pulse rounded-lg" />}>
            {' '}
            <QuickActionsWidget />{' '}
          </Suspense>{' '}
          <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
            {' '}
            <TodayStatsWidget />{' '}
          </Suspense>{' '}
        </div>{' '}
      </div>{' '}
      {/* Full width bottom: Recent orders + Low stock */}{' '}
      <div className="grid gap-6 lg:grid-cols-2">
        {' '}
        <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
          {' '}
          <RecentOrdersWidget />{' '}
        </Suspense>{' '}
        <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
          {' '}
          <LowStockWidget />{' '}
        </Suspense>{' '}
      </div>{' '}
      {/* Extra row: Content overview */}{' '}
      <div className="grid gap-6 lg:grid-cols-3">
        {' '}
        <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
          {' '}
          <ContentOverviewWidget />{' '}
        </Suspense>{' '}
      </div>{' '}
    </div>
  );
}
