'use client';
import { useQueryState } from 'nuqs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PriceRangeFilter } from './price-range-filter';
import type { Category } from '@/types/category';
type FilterSidebarProps = {
  categories: Category[];
  showFeaturedFilter?: boolean;
  basePath?: string;
};
export function FilterSidebar({
  categories,
  showFeaturedFilter = true,
  basePath = '/products',
}: FilterSidebarProps) {
  const pathname = usePathname();
  const [categoryParam, setCategoryParam] = useQueryState('category', {
    defaultValue: '',
    clearOnDefault: true,
  });
  const [isFeatured, setIsFeatured] = useQueryState('featured', {
    defaultValue: '',
    clearOnDefault: true,
  });
  return (
    <aside className="bg-background space-y-6 border p-5">
      {' '}
      {/* Categories */}{' '}
      <div>
        {' '}
        <h3 className="text-muted-foreground mb-4 text-[9px] font-bold tracking-[0.28em] uppercase">
          {' '}
          Categories{' '}
        </h3>{' '}
        <ul className="space-y-0.5">
          {' '}
          <li>
            {' '}
            <Link
              href={basePath}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-150',
                !categoryParam
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              onClick={() => setCategoryParam(null)}
            >
              {' '}
              All{' '}
            </Link>{' '}
          </li>{' '}
          {categories.map((cat) => (
            <li key={cat.id}>
              {' '}
              <Link
                href={`${basePath}?category=${cat.slug}`}
                className={cn(
                  'flex items-center justify-between rounded-md px-3 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-150',
                  categoryParam === cat.slug
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setCategoryParam(cat.slug)}
              >
                {' '}
                {cat.name}{' '}
              </Link>{' '}
            </li>
          ))}{' '}
        </ul>{' '}
      </div>{' '}
      <Separator /> <PriceRangeFilter />{' '}
      {showFeaturedFilter && (
        <>
          {' '}
          <Separator />{' '}
          <div>
            {' '}
            <h3 className="text-muted-foreground mb-4 text-[9px] font-bold tracking-[0.28em] uppercase">
              {' '}
              Filter{' '}
            </h3>{' '}
            <div className="flex items-center gap-3">
              {' '}
              <Checkbox
                id="featured"
                checked={isFeatured === 'true'}
                onCheckedChange={(checked) => setIsFeatured(checked ? 'true' : null)}
                className="rounded-sm"
              />{' '}
              <Label
                htmlFor="featured"
                className="cursor-pointer text-xs font-semibold tracking-[0.14em] uppercase"
              >
                {' '}
                Featured Only{' '}
              </Label>{' '}
            </div>{' '}
          </div>{' '}
        </>
      )}{' '}
    </aside>
  );
}
