import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { CheckCircle2 } from 'lucide-react';
import { getOrderById } from '@/actions/order-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/admin/status-badge';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/constants/order-status';
import { formatDate, formatPrice } from '@/lib/utils';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  stripe: 'Credit Card (Stripe)',
  easypaisa: 'Easypaisa',
  jazzcash: 'JazzCash',
  half: 'Half Payment (50% Now)',
};

type ConfirmationPageProps = { searchParams: Promise<{ orderId?: string }> };

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;
  if (!orderId) {
    notFound();
  }
  const result = await getOrderById(orderId);
  const order = result.data as
    | (Record<string, unknown> & { order_items?: Array<Record<string, unknown>> })
    | null;
  if (result.error || !order) {
    notFound();
  }
  const items = order.order_items || [];
  const shippingAddress = order.shipping_address as Record<string, string> | null;
  const subtotal = items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  const shippingAmount = Number(order.shipping_amount) || 0;
  const discountAmount = Number(order.discount_amount) || 0;
  const totalAmount = Number(order.total_amount) || 0;
  const paymentMethod = String(order.payment_method || '');
  const paymentStatus = String(order.payment_status || '');
  const paidAmount = order.paid_amount != null ? Number(order.paid_amount) : null;
  const paymentScreenshot = order.payment_screenshot ? String(order.payment_screenshot) : null;
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <CheckCircle2 className="text-foreground mb-4 h-16 w-16" />
        <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. Your order has been received and is now being processed.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <StatusBadge
            status={paymentStatus}
            label={PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus}
            className={PAYMENT_STATUS_COLORS[paymentStatus] || ''}
          />
          <span className="border-border bg-muted text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium">
            {PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod}
          </span>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-medium">{String(order.order_number)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(String(order.created_at))}</p>
              </div>
            </div>
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
                  {items.map((item, index) => (
                    <tr key={String(item.id || index)} className="border-b last:border-0">
                      <td className="px-4 py-3">{String(item.product_name || '')}</td>
                      <td className="text-muted-foreground px-4 py-3">
                        {String(item.variant_label || '-')}
                      </td>
                      <td className="px-4 py-3">{Number(item.quantity || 0)}</td>
                      <td className="px-4 py-3">{formatPrice(Number(item.unit_price || 0))}</td>
                      <td className="px-4 py-3 text-right">
                        {formatPrice(Number(item.total_price || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.email}</p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.province}
                  {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.phone}</p>
              </CardContent>
            </Card>
          )}
          {(paymentMethod === 'half' || paymentScreenshot) && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
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
                    <Separator />
                  </>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                {paymentScreenshot && (
                  <div className="pt-2">
                    <p className="text-muted-foreground mb-1 text-xs">Payment Screenshot</p>
                    <a href={paymentScreenshot} target="_blank" rel="noopener noreferrer">
                      <img
                        src={paymentScreenshot}
                        alt="Payment screenshot"
                        className="border-border h-24 w-full rounded-md border object-cover"
                      />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(shippingAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
