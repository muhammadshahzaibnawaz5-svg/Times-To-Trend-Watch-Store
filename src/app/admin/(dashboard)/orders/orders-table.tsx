'use client';
import { useRouter } from 'next/navigation';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
} from '@/constants/order-status';
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'COD',
  stripe: 'Card',
  easypaisa: 'Easypaisa',
  jazzcash: 'JazzCash',
  half: 'Half',
};
interface OrderRow {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
}
export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const columns: Column<OrderRow>[] = [
    { header: 'Order #', accessorKey: 'order_number', sortable: true },
    {
      header: 'Customer',
      accessorKey: (item) => item.profiles?.full_name || item.profiles?.email || 'N/A',
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: (item) => (
        <StatusBadge status={item.status} label={ORDER_STATUS_LABELS[item.status] || item.status} />
      ),
    },
    {
      header: 'Total',
      accessorKey: (item) => `$${(Number(item.total_amount) || 0).toFixed(2)}`,
      sortable: true,
    },
    {
      header: 'Payment',
      accessorKey: (item) => {
        const methodLabel =
          PAYMENT_METHOD_LABELS[item.payment_method || ''] || item.payment_method || '';
        return (
          <div className="flex items-center gap-2">
            {' '}
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${PAYMENT_STATUS_COLORS?.[item.payment_status] || ''}`}
            >
              {' '}
              {PAYMENT_STATUS_LABELS?.[item.payment_status] || item.payment_status}{' '}
            </span>{' '}
            {methodLabel && (
              <span className="border-border bg-muted text-muted-foreground rounded-full border px-2 py-1 text-xs font-medium">
                {' '}
                {methodLabel}{' '}
              </span>
            )}{' '}
          </div>
        );
      },
    },
    {
      header: 'Date',
      accessorKey: (item) => new Date(item.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={orders}
      keyExtractor={(item) => item.id}
      onRowClick={(item) => router.push(`/admin/orders/${item.id}`)}
    />
  );
}
