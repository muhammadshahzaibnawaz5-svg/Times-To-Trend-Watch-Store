'use client';
import { useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
] as const;
type SortSelectProps = { paramName?: string };
export function SortSelect({ paramName = 'sort' }: SortSelectProps) {
  const [sort, setSort] = useQueryState(paramName, { defaultValue: '', clearOnDefault: true });
  return (
    <Select
      value={sort || 'created_at-desc'}
      onValueChange={(val) => setSort(val === 'created_at-desc' ? null : val)}
    >
      {' '}
      <SelectTrigger className="bg-background h-10 w-[210px] shadow-sm">
        {' '}
        <SelectValue placeholder="Sort by" />{' '}
      </SelectTrigger>{' '}
      <SelectContent>
        {' '}
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {' '}
            {opt.label}{' '}
          </SelectItem>
        ))}{' '}
      </SelectContent>{' '}
    </Select>
  );
}
