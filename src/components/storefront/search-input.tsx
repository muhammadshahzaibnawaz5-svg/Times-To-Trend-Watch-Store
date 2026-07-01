'use client';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
type SearchInputProps = { paramName?: string; placeholder?: string };
export function SearchInput({
  paramName = 'q',
  placeholder = 'Search products...',
}: SearchInputProps) {
  const [query, setQuery] = useQueryState(paramName, { defaultValue: '', clearOnDefault: true });
  const [input, setInput] = useState(query || '');
  const debouncedValue = useDebounce(input, 300);
  useEffect(() => {
    setQuery(debouncedValue || null);
  }, [debouncedValue, setQuery]);
  useEffect(() => {
    setInput(query || '');
  }, [query]);
  return (
    <div className="relative">
      {' '}
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />{' '}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="border-input bg-background h-12 pl-10 shadow-sm"
      />{' '}
    </div>
  );
}
