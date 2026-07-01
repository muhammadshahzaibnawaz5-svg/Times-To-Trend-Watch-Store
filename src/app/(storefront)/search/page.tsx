import type { Metadata } from 'next';
import { getProducts } from '@/actions/product-actions';
import { getActiveCategories } from '@/actions/category-actions';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductGrid } from '@/components/storefront/product-grid';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { SearchInput } from '@/components/storefront/search-input';
import { FilterSidebar } from '@/components/storefront/filter-sidebar';
import { SortSelect } from '@/components/storefront/sort-select';
import { Pagination } from '@/components/storefront/pagination';
import { EmptyResults } from '@/components/storefront/empty-results';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  return buildMetadata({
    title: query ? `"${query}" - Search` : 'Search Watches',
    description: query
      ? `Search results for "${query}" at Times to Trend. Find the perfect watch from our collection.`
      : 'Search our collection of premium watches at Times to Trend.',
    path: '/search',
    keywords: `search watches, ${query || 'find watches'}, watch store`,
  });
}

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};
function parseSort(sort: string | undefined): { sortBy: string; sortOrder: 'asc' | 'desc' } {
  if (!sort) return { sortBy: 'created_at', sortOrder: 'desc' };
  const dashIndex = sort.lastIndexOf('-');
  if (dashIndex === -1) return { sortBy: 'created_at', sortOrder: 'desc' };
  return {
    sortBy: sort.slice(0, dashIndex),
    sortOrder: sort.slice(dashIndex + 1) as 'asc' | 'desc',
  };
}
export default async function SearchPage({ searchParams }: Props) {
  const { q, page, sort, minPrice, maxPrice } = await searchParams;
  const { sortBy, sortOrder } = parseSort(sort);
  const currentPage = Number(page) || 1;
  const query = q || '';
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      page: currentPage,
      pageSize: 12,
      search: query || undefined,
      sortBy,
      sortOrder,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    getActiveCategories(),
  ]);
  const { data: products, count, totalPages } = productsResult;
  const { data: categories } = categoriesResult;
  return (
    <main>
      {' '}
      <section className="bg-muted/40 border-b">
        {' '}
        <div className="container mx-auto px-4 py-12 md:py-16">
          {' '}
          <Breadcrumbs items={[{ label: 'Search' }]} />{' '}
          <div className="max-w-3xl">
            {' '}
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.24em] uppercase">
              Find a watch
            </p>{' '}
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Search Products</h1>{' '}
            <p className="text-muted-foreground mt-4 text-base leading-7">
              {' '}
              Search by name, style, or price range to narrow the collection.{' '}
            </p>{' '}
            <div className="mt-6">
              {' '}
              <SearchInput />{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </section>{' '}
      <section className="container mx-auto px-4 py-10 md:py-14">
        {' '}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          {' '}
          {query ? (
            <p className="text-muted-foreground text-sm">
              {' '}
              <span className="text-foreground font-semibold">{count}</span>{' '}
              {count === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;{' '}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Enter a search term to begin.</p>
          )}{' '}
          <SortSelect />{' '}
        </div>{' '}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {' '}
          <div className="hidden lg:block">
            {' '}
            <FilterSidebar categories={categories || []} basePath="/search" />{' '}
          </div>{' '}
          <div>
            {' '}
            {products && products.length > 0 ? (
              <>
                {' '}
                <ProductGrid>
                  {' '}
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}{' '}
                </ProductGrid>{' '}
                <Pagination currentPage={currentPage} totalPages={totalPages} />{' '}
              </>
            ) : query ? (
              <EmptyResults
                title={`No results for "${query}"`}
                description="Try different keywords or check your spelling."
              />
            ) : (
              <EmptyResults
                title="Search for products"
                description="Enter a search term above to find products."
                showReset={false}
              />
            )}{' '}
          </div>{' '}
        </div>{' '}
      </section>{' '}
    </main>
  );
}
