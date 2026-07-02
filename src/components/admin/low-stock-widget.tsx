import { AlertTriangle } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

export async function LowStockWidget() {
  const supabase = await createServerClient();

  let lowStockProducts: { id: string; name: string; slug: string; stock_quantity: number }[] = [];
  try {
    const result = await supabase
      .from('products')
      .select('id, name, slug, stock_quantity')
      .lt('stock_quantity', 5)
      .order('stock_quantity', { ascending: true })
      .limit(10);
    lowStockProducts = (result.data as any[]) || [];
    console.log('[LowStockWidget] products:', lowStockProducts.length);
  } catch (err) {
    console.error('[LowStockWidget] query failed:', err);
    lowStockProducts = [];
  }

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        <h3 className="mb-2 text-sm font-semibold">Low Stock Alerts</h3>
        <p className="text-sm text-green-600">All products have sufficient stock.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Low Stock Alerts</h3>
      </div>
      <div className="divide-y">
        {(lowStockProducts || []).map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="hover:bg-muted/50 flex items-center justify-between px-6 py-3 text-sm"
          >
            <span className="font-medium">{product.name || 'Unknown'}</span>
            <span className="font-medium text-amber-600">{product.stock_quantity ?? 0} left</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
