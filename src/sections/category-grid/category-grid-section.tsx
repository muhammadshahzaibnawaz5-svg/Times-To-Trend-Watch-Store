import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
type CategoryGridProps = { title?: string; subtitle?: string };
export async function CategoryGridSection({ title, subtitle }: CategoryGridProps) {
  const supabase = await createServerClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (!categories?.length) return null;
  return (
    <section className="py-14 md:py-28">
      {' '}
      <div className="container mx-auto px-4">
        {' '}
        {/* Header */}{' '}
        <div className="mb-12 text-center">
          {' '}
          <p className="text-label text-muted-foreground">Collections</p>{' '}
          <span className="section-rule mx-auto mt-3" />{' '}
          <h2
            className="text-4xl font-light tracking-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {' '}
            {title || 'Shop by Category'}{' '}
          </h2>{' '}
          {subtitle && <p className="text-muted-foreground mt-3 text-sm">{subtitle}</p>}{' '}
        </div>{' '}
        {/* Grid */}{' '}
        <div className="bg-border grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-4">
          {' '}
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="card-accent group bg-background hover:bg-muted/30 relative overflow-hidden transition-all duration-300"
            >
              {' '}
              {/* Placeholder with diagonal CSS pattern */}{' '}
              <div className="bg-muted/50 relative aspect-[4/3] overflow-hidden">
                {' '}
                <div className="bg-dot-pattern absolute inset-0 opacity-60" />{' '}
                {/* Category initial */}{' '}
                <div className="absolute inset-0 flex items-center justify-center">
                  {' '}
                  <span
                    className="text-muted-foreground/20 group-hover:text-muted-foreground/30 text-6xl font-light transition-all duration-500 group-hover:scale-110"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {' '}
                    {category.name.charAt(0)}{' '}
                  </span>{' '}
                </div>{' '}
                {/* Number badge */}{' '}
                <div className="text-muted-foreground/40 absolute top-3 left-3 text-[9px] font-bold tracking-[0.3em] uppercase">
                  {' '}
                  {String(i + 1).padStart(2, '0')}{' '}
                </div>{' '}
              </div>{' '}
              {/* Text */}{' '}
              <div className="border-t p-4">
                {' '}
                <h3
                  className="group-hover:text-muted-foreground text-base font-medium tracking-tight transition-colors"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {' '}
                  {category.name}{' '}
                </h3>{' '}
                {category.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-5">
                    {' '}
                    {category.description}{' '}
                  </p>
                )}{' '}
              </div>{' '}
            </Link>
          ))}{' '}
        </div>{' '}
      </div>{' '}
    </section>
  );
}
