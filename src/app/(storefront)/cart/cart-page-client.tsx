'use client';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-16">
        {' '}
        <Breadcrumbs items={[{ label: 'Your Cart' }]} />{' '}
        <div className="mx-auto mt-12 max-w-md text-center">
          {' '}
          <div className="border-border bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full border">
            {' '}
            <ShoppingBag className="text-foreground h-8 w-8" />{' '}
          </div>{' '}
          <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
            Your Cart is Empty
          </h1>{' '}
          <p className="text-muted-foreground mt-3 text-base leading-7">
            {' '}
            Looks like you haven&apos;t added any watches yet. Browse our collection and find the
            perfect timepiece.{' '}
          </p>{' '}
          <div className="mt-8">
            {' '}
            <Button variant="default" size="lg" className="rounded-full px-10" asChild>
              <Link href="/products">Explore Collection</Link>
            </Button>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      {' '}
      <Breadcrumbs items={[{ label: 'Your Cart' }]} />{' '}
      <div className="bg-foreground mt-2 mb-2 h-1 w-16 rounded-full" />{' '}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {' '}
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {' '}
          Shopping Cart{' '}
          <span className="text-muted-foreground ml-2 text-lg font-normal">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>{' '}
        </h1>{' '}
        <Button
          variant="outline"
          onClick={clearCart}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground rounded-full"
        >
          {' '}
          Clear Cart{' '}
        </Button>{' '}
      </div>{' '}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {' '}
        <div className="space-y-4">
          {' '}
          {items.map((item) => {
            const unitPrice = item.discountPrice ?? item.price;
            return (
              <div
                key={item.id}
                className="group border-border bg-card/80 hover:border-border rounded-md border p-4 shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/15 cursor-pointer md:p-5"
              >
                {' '}
                <div className="flex gap-4 md:gap-6">
                  {' '}
                  <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-md md:h-28 md:w-28">
                    {' '}
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="img-premium h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />{' '}
                  </div>{' '}
                  <div className="flex flex-1 flex-col justify-between">
                    {' '}
                    <div>
                      {' '}
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-foreground hover:text-foreground font-semibold transition-colors duration-200"
                      >
                        {' '}
                        {item.name}{' '}
                      </Link>{' '}
                      {item.variantLabel && (
                        <p className="text-muted-foreground mt-0.5 text-sm">{item.variantLabel}</p>
                      )}{' '}
                    </div>{' '}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {' '}
                      <div className="border-border bg-background/50 flex items-center gap-1 rounded-full border p-1">
                        {' '}
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground disabled:hover:text-muted-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Decrease quantity"
                        >
                          {' '}
                          <Minus className="h-3.5 w-3.5" />{' '}
                        </button>{' '}
                        <span className="text-foreground flex h-8 w-10 items-center justify-center text-sm font-medium">
                          {' '}
                          {item.quantity}{' '}
                        </span>{' '}
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
                          aria-label="Increase quantity"
                        >
                          {' '}
                          <Plus className="h-3.5 w-3.5" />{' '}
                        </button>{' '}
                      </div>{' '}
                      <div className="flex items-center gap-4">
                        {' '}
                        <span className="text-foreground text-lg font-bold">
                          {' '}
                          {formatPrice(unitPrice * item.quantity)}{' '}
                        </span>{' '}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
                          aria-label={`Remove ${item.name}`}
                        >
                          {' '}
                          <Trash2 className="h-4 w-4" />{' '}
                        </button>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </div>
            );
          })}{' '}
        </div>{' '}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {' '}
          <div className="border-border relative overflow-hidden rounded-md border bg-gradient-to-br from-[#080808] via-[#0c0c0c] to-[#080808] p-6 shadow-2xl shadow-black/30 md:p-8">
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
                  <span className="text-white/60">Calculated at checkout</span>{' '}
                </div>{' '}
                <div className="flex justify-between border-t border-white/10 pt-3 text-base">
                  {' '}
                  <span className="font-bold text-white">Total</span>{' '}
                  <span className="font-bold text-white">{formatPrice(subtotal)}</span>{' '}
                </div>{' '}
              </div>{' '}
              <div className="mt-8 space-y-3">
                {' '}
                <Button
                  variant="default"
                  size="lg"
                  className="w-full rounded-full text-base"
                  asChild
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>{' '}
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-muted-foreground hover:bg-muted hover:text-foreground w-full rounded-full"
                  asChild
                >
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                  </Link>
                </Button>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
