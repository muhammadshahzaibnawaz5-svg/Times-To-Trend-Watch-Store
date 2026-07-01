import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductGrid } from '@/components/storefront/product-grid';
import { EmptyResults } from '@/components/storefront/empty-results';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { getStoreProducts } from '@/actions/storefront-actions';
import { getActiveCategories } from '@/actions/category-actions';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'All Products',
  description: 'Browse the full watch collection at Times to Trend.',
  path: '/products',
  keywords: 'all watches, watch collection, buy watches online, timepieces',
});

type Props = { searchParams: Promise<{ category?: string; q?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { category: categorySlug, q } = await searchParams;
  const [categoriesResult, productsResult] = await Promise.all([
    getActiveCategories(),
    getStoreProducts({ pageSize: 100, ...(q ? { search: q } : {}) }),
  ]);
  const categories = categoriesResult.data || [];
  const allProducts = productsResult.data || [];
  const categoryMap = new Map(categories.map((c: any) => [c.slug, c.id]));
  const products = categorySlug
    ? allProducts.filter((p: any) => p.category_id === categoryMap.get(categorySlug))
    : allProducts;
  const totalCount = allProducts.length;

  return (
    <main>
      <section className="bg-muted/35 border-b">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <Breadcrumbs items={[{ label: q ? `Search: ${q}` : 'All Products' }]} />
          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-label text-muted-foreground">{q ? 'Search' : 'Shop Watches'}</p>
              <span className="section-rule mt-3" />
              <h1 className="text-4xl leading-tight font-black md:text-6xl">
                {q ? `Results for "${q}"` : 'All Products'}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-7">
                {q
                  ? `Showing ${products.length} ${products.length === 1 ? 'product' : 'products'} matching your search.`
                  : 'Browse premium watches by style, price, and daily use.'}
              </p>
            </div>
            <div className="border-border bg-background text-muted-foreground flex w-fit items-center gap-2 rounded-md border px-4 py-2 text-xs">
              <span>Showing</span>
              <span className="text-foreground font-bold tabular-nums">{products.length}</span>
              <span>of</span>
              <span className="text-foreground font-bold tabular-nums">{totalCount}</span>
              <span>products</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {!q && (
          <div className="mb-10">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/products"
                className={cn(
                  'inline-flex h-10 items-center rounded-md px-4 text-xs font-bold uppercase transition duration-200',
                  !categorySlug
                    ? 'bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground border',
                )}
              >
                All
              </Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    'inline-flex h-10 items-center rounded-md px-4 text-xs font-bold uppercase transition duration-200',
                    categorySlug === cat.slug
                      ? 'bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground border',
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="bg-border mt-6 h-px" />
          </div>
        )}

        {products.length > 0 ? (
          <ProductGrid>
            {products.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </ProductGrid>
        ) : (
          <EmptyResults
            title={q ? `No products found for "${q}"` : 'No watches found'}
            description={
              q
                ? 'Try different keywords or check your spelling.'
                : 'Try changing your filters or explore our best sellers.'
            }
          />
        )}
      </section>
    </main>
  );
}
