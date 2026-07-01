import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category';
type SubcategoryNavProps = { categories: Category[]; currentSlug?: string };
export function SubcategoryNav({ categories, currentSlug }: SubcategoryNavProps) {
  if (!categories.length) return null;
  return (
    <div className="overflow-x-auto">
      {' '}
      <div className="flex gap-2 pb-2">
        {' '}
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={cn(
              'hover:bg-secondary inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
              currentSlug === cat.slug
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-border bg-background',
            )}
          >
            {' '}
            {cat.name}{' '}
          </Link>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
