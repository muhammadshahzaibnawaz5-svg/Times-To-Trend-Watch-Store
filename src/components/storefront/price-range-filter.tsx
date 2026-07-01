'use client';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
type PriceRangeFilterProps = { minParam?: string; maxParam?: string };
export function PriceRangeFilter({
  minParam = 'minPrice',
  maxParam = 'maxPrice',
}: PriceRangeFilterProps) {
  const [minPrice, setMinPrice] = useQueryState(minParam, {
    defaultValue: '',
    clearOnDefault: true,
  });
  const [maxPrice, setMaxPrice] = useQueryState(maxParam, {
    defaultValue: '',
    clearOnDefault: true,
  });
  const [minInput, setMinInput] = useState(minPrice || '');
  const [maxInput, setMaxInput] = useState(maxPrice || '');
  const debouncedMin = useDebounce(minInput, 400);
  const debouncedMax = useDebounce(maxInput, 400);
  useEffect(() => {
    setMinPrice(debouncedMin || null);
  }, [debouncedMin, setMinPrice]);
  useEffect(() => {
    setMaxPrice(debouncedMax || null);
  }, [debouncedMax, setMaxPrice]);
  useEffect(() => {
    setMinInput(minPrice || '');
  }, [minPrice]);
  useEffect(() => {
    setMaxInput(maxPrice || '');
  }, [maxPrice]);
  return (
    <div className="space-y-3">
      {' '}
      <Label className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
        Price Range
      </Label>{' '}
      <div className="flex items-center gap-2">
        {' '}
        <Input
          type="number"
          placeholder="Min"
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          className="h-10"
        />{' '}
        <span className="text-muted-foreground">-</span>{' '}
        <Input
          type="number"
          placeholder="Max"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          className="h-10"
        />{' '}
      </div>{' '}
    </div>
  );
}
