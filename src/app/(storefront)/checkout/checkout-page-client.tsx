'use client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { checkoutAction } from '@/actions/order-actions';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { shippingAddressSchema } from '@/schemas/order-schema';
import type { CreateOrderInput } from '@/schemas/order-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { PaymentDialog } from './payment-dialog';
const checkoutFormSchema = z.object({
  ...shippingAddressSchema.shape,
  paymentMethod: z.string().min(1, 'Payment method is required'),
});
const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives' },
  { value: 'stripe', label: 'Credit Card (Stripe)', description: 'Secure online payment' },
  { value: 'easypaisa', label: 'Easypaisa', description: 'Mobile wallet payment' },
  { value: 'jazzcash', label: 'JazzCash', description: 'Mobile wallet payment' },
  { value: 'half', label: 'Half Payment (50% Now)', description: 'Pay 50% now, 50% on delivery' },
] as const;
type PaymentMethod = (typeof paymentMethods)[number]['value'];
type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    checkoutData: CreateOrderInput;
    totalAmount: number;
    paymentMethod: PaymentMethod;
  } | null>(null);
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      paymentMethod: 'cod',
    },
  });
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);
  const orderItems = useMemo(() => {
    return items.map((item) => {
      const unitPrice = item.discountPrice ?? item.price;
      return {
        productId: item.productId,
        productName: item.name,
        productImage: item.image || null,
        variantLabel: item.variantLabel || null,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      };
    });
  }, [items]);
  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) {
      router.replace('/cart');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!/^(\+92|0)[0-9]{10}$/.test(values.phone)) {
      toast.error('Please enter a valid phone number (e.g., 03XXXXXXXXX or +923XXXXXXXXX).');
      return;
    }
    const checkoutData: CreateOrderInput = {
      shippingAddress: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
      },
      paymentMethod: values.paymentMethod,
      items: orderItems,
      shippingAmount: 0,
      discountAmount: 0,
    };
    if (values.paymentMethod === 'cod') {
      startTransition(async () => {
        const result = await checkoutAction(checkoutData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (!result.data) {
          toast.error('Order could not be created.');
          return;
        }
        clearCart();
        router.push(`/checkout/confirmation?orderId=${result.data.id}`);
      });
      return;
    }
    setPendingOrder({
      checkoutData,
      totalAmount: subtotal,
      paymentMethod: values.paymentMethod as PaymentMethod,
    });
    setPaymentDialogOpen(true);
  }
  function handlePaymentSuccess(orderId: string) {
    setPaymentDialogOpen(false);
    clearCart();
    router.push(`/checkout/confirmation?orderId=${orderId}`);
  }
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      {' '}
      <Breadcrumbs items={[{ label: 'Checkout' }]} />{' '}
      <div className="bg-foreground mt-2 mb-2 h-1 w-16 rounded-full" />{' '}
      <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
        Secure Checkout
      </h1>{' '}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {' '}
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
          {' '}
          <div className="border-border bg-card/80 relative overflow-hidden rounded-md border p-6 shadow-xl shadow-black/10 backdrop-blur-sm md:p-8 cursor-pointer transition-shadow duration-300 hover:shadow-2xl">
            {' '}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.03),transparent_50%)]" />{' '}
            <div className="relative z-10">
              {' '}
              <div className="border-border bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.25em] uppercase">
                {' '}
                Shipping Details{' '}
              </div>{' '}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {' '}
                <div className="space-y-2 sm:col-span-2">
                  {' '}
                  <Label htmlFor="fullName" className="text-foreground">
                    {' '}
                    Full Name <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="fullName"
                    {...form.register('fullName')}
                    placeholder="Your full name"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                  {form.formState.errors.fullName && (
                    <p className="text-foreground text-sm">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}{' '}
                </div>{' '}
                <div className="space-y-2 sm:col-span-2">
                  {' '}
                  <Label htmlFor="phone" className="text-foreground">
                    {' '}
                    Phone <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="+92 300 1234567"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                   {form.formState.errors.phone && (
                     <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>
                   )}{' '}
                </div>{' '}
                <div className="space-y-2 sm:col-span-2">
                  {' '}
                  <Label htmlFor="email" className="text-foreground">
                    {' '}
                    Email <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="your@email.com"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.email.message}
                    </p>
                  )}{' '}
                </div>{' '}
                <div className="space-y-2 sm:col-span-2">
                  {' '}
                  <Label htmlFor="address" className="text-foreground">
                    {' '}
                    Address <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder="Street address"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                  {form.formState.errors.address && (
                    <p className="text-foreground text-sm">
                      {form.formState.errors.address.message}
                    </p>
                  )}{' '}
                </div>{' '}
                <div className="space-y-2">
                  {' '}
                  <Label htmlFor="city" className="text-foreground">
                    {' '}
                    City <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="City"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                  {form.formState.errors.city && (
                    <p className="text-foreground text-sm">{form.formState.errors.city.message}</p>
                  )}{' '}
                </div>{' '}
                <div className="space-y-2">
                  {' '}
                  <Label htmlFor="province" className="text-foreground">
                    {' '}
                    Province <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="province"
                    {...form.register('province')}
                    placeholder="Province"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                  {form.formState.errors.province && (
                    <p className="text-foreground text-sm">
                      {form.formState.errors.province.message}
                    </p>
                  )}{' '}
                </div>{' '}
                <div className="space-y-2 sm:col-span-2">
                  {' '}
                  <Label htmlFor="postalCode" className="text-foreground">
                    {' '}
                    Postal Code <span className="text-foreground">*</span>{' '}
                  </Label>{' '}
                  <Input
                    id="postalCode"
                    {...form.register('postalCode')}
                    placeholder="e.g. 74000"
                    className="border-border bg-background/50 focus-visible:ring-ring transition-all duration-200 focus-visible:ring-offset-0"
                  />{' '}
                  {form.formState.errors.postalCode && (
                    <p className="text-foreground text-sm">
                      {form.formState.errors.postalCode.message}
                    </p>
                  )}{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <div className="border-border bg-card/80 relative overflow-hidden rounded-md border p-6 shadow-xl shadow-black/10 backdrop-blur-sm md:p-8 cursor-pointer transition-shadow duration-300 hover:shadow-2xl">
            {' '}
            <div className="relative z-10">
              {' '}
              <div className="border-border bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.25em] uppercase">
                {' '}
                Payment Method{' '}
              </div>{' '}
              <div className="mt-6 space-y-3">
                {' '}
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-md border p-4 transition-all duration-200 hover:shadow-lg ${form.watch('paymentMethod') === method.value ? 'border-foreground bg-muted shadow-md' : 'border-border bg-background/30 hover:border-border hover:bg-muted/40'}`}
                  >
                    {' '}
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${form.watch('paymentMethod') === method.value ? 'border-foreground bg-foreground' : 'border-muted-foreground/30'}`}
                    >
                      {' '}
                      {form.watch('paymentMethod') === method.value && (
                        <div className="bg-background h-2 w-2 rounded-full" />
                      )}{' '}
                    </div>{' '}
                    <input
                      type="radio"
                      value={method.value}
                      {...form.register('paymentMethod')}
                      className="sr-only"
                    />{' '}
                    <div>
                      {' '}
                      <p className="text-foreground font-medium">{method.label}</p>{' '}
                      <p className="text-muted-foreground text-sm">{method.description}</p>{' '}
                    </div>{' '}
                  </label>
                ))}{' '}
                {form.formState.errors.paymentMethod && (
                  <p className="text-foreground text-sm">
                    {form.formState.errors.paymentMethod.message}
                  </p>
                )}{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isPending}
            className="w-full rounded-full text-base md:w-auto md:px-12"
          >
            {' '}
            {isPending ? 'Processing...' : 'Place Order'}{' '}
          </Button>{' '}
        </form>{' '}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {' '}
          <div className="border-border relative overflow-hidden rounded-md border bg-gradient-to-br from-[#080808] via-[#0c0c0c] to-[#080808] p-6 shadow-2xl shadow-black/30 md:p-8 cursor-pointer transition-shadow duration-300 hover:shadow-3xl">
            {' '}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_50%)]" />{' '}
            <div className="relative z-10">
              {' '}
              <div className="border-border bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.25em] uppercase">
                {' '}
                Order Summary{' '}
              </div>{' '}
              <div className="mt-6 space-y-4">
                {' '}
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
                    {' '}
                    <div className="min-w-0 flex-1">
                      {' '}
                      <p className="truncate font-medium text-white">{item.name}</p>{' '}
                      <p className="text-white/50">
                        {' '}
                        Qty: {item.quantity}{' '}
                        {item.variantLabel ? ` \u2022 ${item.variantLabel}` : ''}{' '}
                      </p>{' '}
                    </div>{' '}
                    <span className="shrink-0 font-semibold text-white">
                      {' '}
                      {formatPrice((item.discountPrice ?? item.price) * item.quantity)}{' '}
                    </span>{' '}
                  </div>
                ))}{' '}
              </div>{' '}
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/35 to-transparent" />{' '}
              <div className="mt-6 space-y-3 text-sm">
                {' '}
                <div className="flex justify-between">
                  {' '}
                  <span className="text-white/60">Subtotal</span>{' '}
                  <span className="font-semibold text-white">{formatPrice(subtotal)}</span>{' '}
                </div>{' '}
                <div className="flex justify-between">
                  {' '}
                  <span className="text-white/60">Shipping</span>{' '}
                  <span className="text-white">Free</span>{' '}
                </div>{' '}
                <div className="flex justify-between border-t border-white/10 pt-3 text-base">
                  {' '}
                  <span className="font-bold text-white">Total</span>{' '}
                  <span className="font-bold text-white">{formatPrice(subtotal)}</span>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      {pendingOrder && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          pendingOrder={pendingOrder}
          onSuccess={handlePaymentSuccess}
        />
      )}{' '}
    </div>
  );
}
