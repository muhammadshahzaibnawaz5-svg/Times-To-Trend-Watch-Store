import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryBySlug, getActiveCategories } from '@/actions/category-actions';
import { getProducts } from '@/actions/product-actions';
import { buildCategoryMetadata, breadcrumbJsonLd } from '@/lib/seo';
import {
  FilterSidebarSection,
  FilterSidebarSkeleton,
  ProductGridSection,
  ProductGridSkeleton,
} from '@/components/storefront/product-list-sections';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { SubcategoryNav } from '@/components/storefront/subcategory-nav';
import { SortSelect } from '@/components/storefront/sort-select';
import { Pagination } from '@/components/storefront/pagination';
import { EmptyResults } from '@/components/storefront/empty-results';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await getCategoryBySlug(slug);

  if (!category) return { title: 'Category Not Found' };

  return buildCategoryMetadata({
    name: category.name,
    slug: category.slug,
    description: category.description,
    seo_title: (category as any).seo_title || null,
    seo_description: (category as any).seo_description || null,
    seo_keywords: (category as any).seo_keywords || null,
    og_image: (category as any).og_image || null,
    image_url: category.image_url,
  });
}

function parseSort(sort: string | undefined): {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
} {
  if (!sort) return { sortBy: 'created_at', sortOrder: 'desc' };
  const dashIndex = sort.lastIndexOf('-');
  if (dashIndex === -1) return { sortBy: 'created_at', sortOrder: 'desc' };
  return {
    sortBy: sort.slice(0, dashIndex),
    sortOrder: sort.slice(dashIndex + 1) as 'asc' | 'desc',
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, sort, minPrice, maxPrice } = await searchParams;

  const { data: category } = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { sortBy, sortOrder } = parseSort(sort);
  const currentPage = Number(page) || 1;

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      page: currentPage,
      pageSize: 12,
      categoryId: category.id,
      sortBy,
      sortOrder,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    getActiveCategories(),
  ]);

  const { data: products, totalPages } = productsResult;
  const { data: categories } = categoriesResult;

  return (
    <main>
      <section className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Breadcrumbs
            items={[{ label: 'All Products', href: '/products' }, { label: category.name }]}
          />

          <div className="max-w-3xl">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.24em] uppercase">
              Category
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-4 text-base leading-7">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-6">
          <SubcategoryNav categories={categories || []} currentSlug={slug} />
        </div>

        <div className="mb-6 flex justify-end">
          <SortSelect />
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebarSection
                categories={categories || []}
                basePath={`/categories/${slug}`}
                showFeaturedFilter={false}
              />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGridSection
                products={products || []}
                currentPage={currentPage}
                totalPages={totalPages}
                emptyTitle="No products in this category"
                emptyDescription="Try adjusting your filters or browse other categories."
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
