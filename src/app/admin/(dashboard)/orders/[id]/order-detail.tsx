'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from '@/constants/order-status';
import {
  updateOrderStatus,
  updatePaymentStatusAction,
  markHalfPaymentDeliveredAction,
} from '@/actions/order-actions';
import { formatPrice } from '@/lib/utils';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  stripe: 'Credit Card (Stripe)',
  easypaisa: 'Easypaisa',
  jazzcash: 'JazzCash',
  half: 'Half Payment (50% Now)',
};

const PAYMENT_METHODS = ['pending', 'half_paid', 'paid', 'failed', 'refunded'];

interface OrderDetailProps {
  order: Record<string, unknown>;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const items = (order.order_items as Array<Record<string, unknown>>) || [];
  const profile = order.profiles as Record<string, unknown> | null;
  const shippingAddress = order.shipping_address as Record<string, string> | null;

  const subtotal = items.reduce((sum: number, item: Record<string, unknown>) => {
    return sum + Number(item.unit_price) * Number(item.quantity);
  }, 0);

  const shippingAmount = Number(order.shipping_amount) || 0;
  const discountAmount = Number(order.discount_amount) || 0;
  const totalAmount = Number(order.total_amount) || 0;
  const paymentMethod = String(order.payment_method || '');
  const paymentStatus = String(order.payment_status || '');
  const paidAmount = order.paid_amount != null ? Number(order.paid_amount) : null;
  const paymentScreenshot = order.payment_screenshot ? String(order.payment_screenshot) : null;

  async function handleStatusChange(status: string) {
    const result = await updateOrderStatus(order.id as string, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Order status updated');
      startTransition(() => router.refresh());
    }
  }

  async function handlePaymentStatusChange(status: string) {
    const result = await updatePaymentStatusAction(order.id as string, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Payment status updated');
      startTransition(() => router.refresh());
    }
  }

  async function handleMarkFullyPaid() {
    const result = await markHalfPaymentDeliveredAction(order.id as string, totalAmount);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Order marked as fully paid');
      startTransition(() => router.refresh());
    }
  }

  const orderInfoData = [
    { label: 'Order #', value: String(order.order_number || '') },
    { label: 'Date', value: new Date(String(order.created_at || '')).toLocaleDateString() },
    {
      label: 'Status',
      value: (
        <StatusBadge
          status={String(order.status || '')}
          label={ORDER_STATUS_LABELS[String(order.status)] || String(order.status)}
        />
      ),
    },
    {
      label: 'Payment',
      value: (
        <StatusBadge
          status={paymentStatus}
          label={PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus}
        />
      ),
    },
    {
      label: 'Payment Method',
      value: PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || 'N/A',
    },
  ];

  if (paidAmount != null) {
    orderInfoData.push({ label: 'Paid Amount', value: formatPrice(paidAmount) });
    const dueAmount = totalAmount - paidAmount;
    if (dueAmount > 0) {
      orderInfoData.push({ label: 'Due Amount', value: formatPrice(dueAmount) });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order {order.order_number as string}</h1>
        <Button variant="outline" onClick={() => router.push('/admin/orders')}>
          Back to Orders
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {orderInfoData.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>
                {(profile?.full_name as string) || (shippingAddress?.fullName as string) || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{(shippingAddress?.email as string) || (profile?.email as string) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span>
                {(profile?.phone as string) || (shippingAddress?.phone as string) || 'N/A'}
              </span>
            </div>
            {shippingAddress && (
              <>
                <div className="border-border mt-2 border-t pt-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="max-w-[200px] text-right">
                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.province}{' '}
                    {shippingAddress.postalCode}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{shippingAddress.fullName}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.phone}</p>
          </CardContent>
        </Card>
      )}

      {(paymentMethod === 'half' || paymentScreenshot) && (
        <Card>
          <CardHeader>
            <CardTitle>
              Payment Details{paymentMethod === 'half' ? ' (Half Payment)' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {paymentMethod === 'half' && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid upfront</span>
                  <span className="font-medium text-green-600">
                    {paidAmount ? formatPrice(paidAmount) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due on delivery</span>
                  <span className="font-medium">
                    {formatPrice(totalAmount - (paidAmount || 0))}
                  </span>
                </div>
                <div className="border-border flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </>
            )}
            {paymentScreenshot && (
              <div className="pt-2">
                <p className="text-muted-foreground mb-2 text-xs font-medium">Payment Screenshot</p>
                <a href={paymentScreenshot} target="_blank" rel="noopener noreferrer">
                  <img
                    src={paymentScreenshot}
                    alt="Payment screenshot"
                    className="border-border h-40 w-full rounded-md border object-cover transition-opacity hover:opacity-90"
                  />
                </a>
              </div>
            )}
            {paymentStatus === 'half_paid' && (
              <Button onClick={handleMarkFullyPaid} className="w-full rounded-full">
                Mark as Fully Paid — Delivered
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Variant</th>
                <th className="px-4 py-3 text-left font-medium">Qty</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: Record<string, unknown>, idx: number) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-4 py-3">{item.product_name as string}</td>
                  <td className="text-muted-foreground px-4 py-3">
                    {(item.variant_label as string) || '-'}
                  </td>
                  <td className="px-4 py-3">{item.quantity as number}</td>
                  <td className="px-4 py-3">{formatPrice(Number(item.unit_price))}</td>
                  <td className="px-4 py-3 text-right">
                    {formatPrice(Number(item.unit_price) * Number(item.quantity))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td colSpan={4} className="text-muted-foreground px-4 py-2 text-right">
                  Subtotal
                </td>
                <td className="px-4 py-2 text-right">{formatPrice(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-2 text-right">
                  Shipping
                </td>
                <td className="px-4 py-2 text-right">{formatPrice(shippingAmount)}</td>
              </tr>
              {discountAmount > 0 && (
                <tr>
                  <td colSpan={4} className="text-muted-foreground px-4 py-2 text-right">
                    Discount
                  </td>
                  <td className="px-4 py-2 text-right">-{formatPrice(discountAmount)}</td>
                </tr>
              )}
              <tr className="border-t font-bold">
                <td colSpan={4} className="px-4 py-2 text-right">
                  Total
                </td>
                <td className="px-4 py-2 text-right">{formatPrice(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select onValueChange={handleStatusChange} defaultValue={order.status as string}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select onValueChange={handlePaymentStatusChange} defaultValue={paymentStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PAYMENT_STATUS_LABELS[value] || value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {!!order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{String(order.notes)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
