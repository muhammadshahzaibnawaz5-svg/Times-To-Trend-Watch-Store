import { ProductCard } from '@/components/storefront/product-card';
import { getSectionProducts } from '@/sections/section-products-helper';
type BestSellersProps = { title?: string; subtitle?: string; sectionId?: string };
export async function BestSellersSection({ title, subtitle, sectionId }: BestSellersProps) {
  const products = await getSectionProducts(sectionId, async (supabase) => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8);
    return data;
  });
  if (!products?.length) return null;
  return (
    <section className="py-16">
      {' '}
      <div className="container mx-auto px-4">
        {' '}
        <div className="mb-10 text-center">
          {' '}
          <h2 className="text-3xl font-bold tracking-tight">{title || 'Best Sellers'}</h2>{' '}
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}{' '}
        </div>{' '}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {' '}
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}{' '}
        </div>{' '}
      </div>{' '}
    </section>
  );
}
