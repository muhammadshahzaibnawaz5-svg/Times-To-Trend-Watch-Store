import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ProductImage, ProductVariant } from '@/types/product';
import { getProductBySlug } from '@/actions/product-actions';
import { getProductReviews } from '@/actions/review-actions';
import { formatPrice } from '@/lib/utils';
import { buildProductMetadata, productJsonLd } from '@/lib/seo';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { ProductImageGallery } from '@/components/storefront/product-image-gallery';
import { RatingStars } from '@/components/storefront/rating-stars';
import { VariantSelector } from '@/components/storefront/variant-selector';
import { QuantitySelector } from '@/components/storefront/quantity-selector';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { WishlistButton } from '@/components/storefront/wishlist-button';
import { RelatedProducts } from '@/components/storefront/related-products';
import { RecentlyViewedTracker } from '@/components/storefront/recently-viewed-tracker';
import { RecentlyViewed } from '@/components/storefront/recently-viewed';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await getProductBySlug(slug);

  if (!product) return { title: 'Product Not Found' };

  return buildProductMetadata({
    name: product.name,
    slug: product.slug,
    description: product.description,
    seo_title: (product as any).seo_title || null,
    seo_description: (product as any).seo_description || null,
    seo_keywords: (product as any).seo_keywords || null,
    og_image: (product as any).og_image || null,
    images: product.images as { url: string }[] | null,
    price: product.price,
    discount_price: product.discount_price,
    stock_quantity: product.stock_quantity,
    created_at: product.created_at,
    updated_at: product.updated_at,
  });
}

const specDetails = [
  { label: 'Material', value: 'Stainless Steel' },
  { label: 'Case Size', value: '42mm' },
  { label: 'Strap Type', value: 'Premium Leather' },
  { label: 'Warranty', value: '1 Year International' },
  { label: 'Delivery', value: '3–5 Business Days' },
];

const trustBadges = [
  { icon: ShieldCheck, label: 'Secure Checkout' },
  { icon: Truck, label: 'Free Shipping' },
  { icon: RotateCcw, label: '30-Day Returns' },
  { icon: Clock, label: '1 Year Warranty' },
];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  const product = result.data as unknown as {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    sku: string | null;
    stock_quantity: number;
    category_id: string | null;
    status: string;
    is_featured: boolean;
    images: ProductImage[];
    variants: ProductVariant[];
    meta_title: string | null;
    meta_description: string | null;
    categories: { name: string; slug: string } | null;
    created_at: string;
    updated_at: string;
  } | null;

  if (!product) notFound();

  const validImages = (product.images || []).filter(
    (img: any) => img?.url && typeof img.url === 'string',
  );
  const images = validImages.length
    ? validImages.map((img: any, i: number) => ({ id: `img-${i}`, url: img.url, alt: img.alt }))
    : [{ id: 'placeholder', url: '/images/New-watch.webp', alt: product.name }];
  const variants = product.variants || [];
  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    product.discount_price > 0;
  const displayPrice = hasDiscount ? product.discount_price! : product.price;

  const category = product.categories;
  const categoryId = product.category_id || '';
  const productId = product.id;

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.description,
    images: images.map((i: any) => ({ url: i.url })),
    price: product.price,
    discount_price: product.discount_price,
    stock_quantity: product.stock_quantity,
  });

  const reviewsResult = await getProductReviews(productId);
  const reviews =
    (reviewsResult.data as unknown as Array<{
      id: string;
      rating: number;
      comment: string | null;
      created_at: string;
      profiles: { full_name: string | null; avatar_url: string | null } | null;
    }>) || [];

  const avgRating = reviews.length
    ? reviews.reduce((s: number, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* ─── Breadcrumbs ──────────────────────────────────── */}
        <Breadcrumbs
          items={[
            { label: 'All Products', href: '/products' },
            ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        {/* ─── Product Hero ─────────────────────────────────── */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
          {/* ─── Image Gallery ─────────────────────────────── */}
          <div className="border-border/60 bg-card rounded-xl border p-2 shadow-lg shadow-black/5 cursor-pointer transition-shadow duration-300 hover:shadow-xl">
            <ProductImageGallery images={images} productName={product.name} />
          </div>

          {/* ─── Product Info ───────────────────────────────── */}
          <div className="flex flex-col">
            {category && (
              <span className="border-border bg-muted/50 text-muted-foreground inline-flex w-fit items-center rounded-full border px-4 py-1 text-[11px] font-bold tracking-[0.2em] uppercase">
                {category.name}
              </span>
            )}

            <h1
              className="mt-4 text-4xl leading-[1.1] font-black tracking-tight md:text-5xl"
              style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
            >
              {product.name}
            </h1>

            {reviews.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <RatingStars rating={avgRating} size="sm" />
                <span className="text-muted-foreground text-xs">
                  {avgRating.toFixed(1)} ({reviews.length}{' '}
                  {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums md:text-4xl">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-muted-foreground text-lg tabular-nums line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-foreground text-background inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.16em] uppercase">
                    {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mt-6 text-sm leading-7">{product.description}</p>
            )}

            {/* ─── Specifications ────────────────────────── */}
            <div className="border-border/60 bg-muted/30 mt-8 rounded-xl border p-5 md:p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
              <h3 className="text-foreground text-xs font-bold tracking-[0.2em] uppercase">
                Specifications
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {specDetails.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-2">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="text-foreground font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Variants ──────────────────────────────── */}
            {variants.length > 0 && (
              <div className="mt-6">
                <VariantSelector variants={variants} />
              </div>
            )}

            {/* ─── Quantity + Add to Cart ────────────────── */}
            <div className="mt-8 flex items-center gap-4">
              <QuantitySelector />
              <div className="flex-1">
                <AddToCartButton
                  product={{
                    id: productId,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    discountPrice: product.discount_price,
                    image: images[0]?.url || '',
                  }}
                />
              </div>
              <WishlistButton product={product} variant="full" />
            </div>

            {product.sku && (
              <p className="text-muted-foreground mt-4 text-xs">
                SKU: <span className="font-mono">{product.sku}</span>
              </p>
            )}

            {/* ─── Trust Badges ──────────────────────────── */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="border-border/40 bg-muted/20 flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-shadow duration-300 hover:shadow-md"
                  >
                    <Icon className="text-foreground/70 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span className="text-foreground/70 text-[11px] font-semibold tracking-[0.1em] uppercase">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Recently Viewed Tracker ──────────────────────── */}
        <RecentlyViewedTracker
          product={{
            id: productId,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discount_price: product.discount_price,
            image: images[0]?.url || '',
            categories: category,
          }}
        />

        {/* ─── Related Products ──────────────────────────────── */}
        {categoryId && (
          <div className="mt-16">
            <Separator className="bg-border/60 mb-12" />
            <RelatedProducts productId={productId} categoryId={categoryId} />
          </div>
        )}

        {/* ─── Recently Viewed ────────────────────────────────── */}
        <RecentlyViewed />
      </div>
    </>
  );
}
