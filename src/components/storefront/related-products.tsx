import { Suspense } from 'react';
import { getRelatedProducts } from '@/actions/product-actions';
import { ProductCard } from './product-card';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-list-sections';
type RelatedProductsProps = { productId: string; categoryId: string };
async function RelatedProductsContent({ productId, categoryId }: RelatedProductsProps) {
  const { data: products } = await getRelatedProducts(productId, categoryId);
  if (!products?.length) return null;
  return (
    <div className="mt-12">
      {' '}
      <h2 className="mb-6 text-2xl font-bold">Related Products</h2>{' '}
      <ProductGrid className="md:grid-cols-4">
        {' '}
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product as any} priority={index < 4} />
        ))}{' '}
      </ProductGrid>{' '}
    </div>
  );
}
export function RelatedProducts(props: RelatedProductsProps) {
  return (
    <Suspense
      fallback={
        <div className="mt-12">
          <ProductGridSkeleton count={4} />
        </div>
      }
    >
      {' '}
      <RelatedProductsContent {...props} />{' '}
    </Suspense>
  );
}
