'use client';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types/product';
type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedId?: string;
  onChange?: (variant: ProductVariant) => void;
};
export function VariantSelector({ variants, selectedId, onChange }: VariantSelectorProps) {
  if (!variants.length) return null;
  return (
    <div className="space-y-3">
      {' '}
      <h3 className="text-sm font-medium">Variants</h3>{' '}
      <div className="flex flex-wrap gap-2">
        {' '}
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange?.(v)}
            className={cn(
              'cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors',
              selectedId === v.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'hover:border-muted-foreground',
            )}
          >
            {' '}
            {v.label}: {v.value} {v.price != null && ` (+$${v.price})`}{' '}
          </button>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
