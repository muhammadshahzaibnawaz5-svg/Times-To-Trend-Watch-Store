import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductGrid } from '@/components/storefront/product-grid';
import { EmptyResults } from '@/components/storefront/empty-results';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { getStoreProducts } from '@/actions/storefront-actions';
import { buildMetadata } from '@/lib/seo';
export const metadata: Metadata = buildMetadata({
  title: 'Featured Watches',
  description: 'Our handpicked selection of standout timepieces at Times to Trend.',
  path: '/featured-watches',
  keywords: 'featured watches, best watches, premium collection, curated watches',
});
export default async function FeaturedWatchesPage() {
  const { data: products } = await getStoreProducts({ isFeatured: true, pageSize: 100 });
  const items = products || [];
  return (
    <main>
      {' '}
      <section className="bg-muted/30 border-b">
        {' '}
        <div className="container mx-auto px-4 py-14 md:py-20">
          {' '}
          <Breadcrumbs items={[{ label: 'Featured Watches' }]} />{' '}
          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            {' '}
            <div>
              {' '}
              <p className="text-label text-muted-foreground">Curated Selection</p>{' '}
              <span className="section-rule mt-3" />{' '}
              <h1
                className="text-4xl font-black tracking-tight md:text-6xl"
                style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
              >
                {' '}
                Featured Watches{' '}
              </h1>{' '}
              <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-7">
                {' '}
                A handpicked selection of standout timepieces â€” each chosen for its design,
                craftsmanship, and character.{' '}
              </p>{' '}
            </div>{' '}
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              {' '}
              <span>Showing</span>{' '}
              <span className="text-foreground font-bold tabular-nums">{items.length}</span>{' '}
              <span>featured watches</span>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </section>{' '}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {' '}
        {items.length > 0 ? (
          <ProductGrid>
            {' '}
            {items.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}{' '}
          </ProductGrid>
        ) : (
          <EmptyResults
            title="No featured watches yet"
            description="Featured pieces will appear here once selected. Check back soon."
          />
        )}{' '}
        <div className="mt-16 flex justify-center">
          {' '}
          <Link
            href="/products"
            className="group border-foreground hover:bg-foreground hover:text-background inline-flex h-12 items-center gap-3 rounded-full border px-8 text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300"
          >
            {' '}
            View All Products{' '}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{' '}
          </Link>{' '}
        </div>{' '}
      </section>{' '}
    </main>
  );
}
