import { Suspense } from 'react';
import type { Category } from '@/types/category';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductGrid } from '@/components/storefront/product-grid';
import { FilterSidebar } from '@/components/storefront/filter-sidebar';
import { Pagination } from '@/components/storefront/pagination';
import { EmptyResults } from '@/components/storefront/empty-results';
import { Skeleton } from '@/components/ui/skeleton';
type ProductLike = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  images: unknown;
  status: string;
  categories?: { name: string; slug: string } | null;
};
type FilterSidebarSectionProps = {
  categories: Category[];
  basePath: string;
  showFeaturedFilter?: boolean;
};
type ProductGridSectionProps = {
  products: ProductLike[];
  currentPage: number;
  totalPages: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-4">
      {' '}
      <Skeleton className="h-4 w-24" /> <Skeleton className="h-8 w-full" />{' '}
      <Skeleton className="h-8 w-full" /> <Skeleton className="h-8 w-full" />{' '}
    </div>
  );
}
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ProductGrid>
      {' '}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-border/60 space-y-3 rounded-xl border p-4 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
          {' '}
          <Skeleton className="aspect-square w-full rounded-lg" /> <Skeleton className="h-3 w-20" />{' '}
          <Skeleton className="h-4 w-3/4" /> <Skeleton className="h-3 w-24" />{' '}
          <Skeleton className="h-4 w-1/3" /> <Skeleton className="h-9 w-full rounded-full" />{' '}
        </div>
      ))}{' '}
    </ProductGrid>
  );
}
async function FilterSidebarContent({
  categories,
  basePath,
  showFeaturedFilter,
}: FilterSidebarSectionProps) {
  return (
    <FilterSidebar
      categories={categories}
      basePath={basePath}
      showFeaturedFilter={showFeaturedFilter}
    />
  );
}
export function FilterSidebarSection(props: FilterSidebarSectionProps) {
  return (
    <Suspense fallback={<FilterSidebarSkeleton />}>
      {' '}
      <FilterSidebarContent {...props} />{' '}
    </Suspense>
  );
}
async function ProductGridContent({
  products,
  currentPage,
  totalPages,
  emptyTitle,
  emptyDescription,
}: ProductGridSectionProps) {
  if (!products.length) {
    return emptyTitle || emptyDescription ? (
      <EmptyResults title={emptyTitle} description={emptyDescription} />
    ) : (
      <EmptyResults />
    );
  }
  return (
    <>
      {' '}
      <ProductGrid>
        {' '}
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}{' '}
      </ProductGrid>{' '}
      <Pagination currentPage={currentPage} totalPages={totalPages} />{' '}
    </>
  );
}
export function ProductGridSection(props: ProductGridSectionProps) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      {' '}
      <ProductGridContent {...props} />{' '}
    </Suspense>
  );
}
