'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ListTree, FileText, ShoppingCart } from 'lucide-react';
interface SearchResult {
  label: string;
  href: string;
  icon: 'product' | 'category' | 'page' | 'order';
}
const iconMap = { product: Package, category: ListTree, page: FileText, order: ShoppingCart };
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'page' },
    { label: 'View Products', href: '/admin/products', icon: 'product' },
    { label: 'View Categories', href: '/admin/categories', icon: 'category' },
    { label: 'View Pages', href: '/admin/pages', icon: 'page' },
    { label: 'View Orders', href: '/admin/orders', icon: 'order' },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);
  useEffect(() => {
    if (!query) {
      setResults([
        { label: 'Dashboard', href: '/admin/dashboard', icon: 'page' },
        { label: 'View Products', href: '/admin/products', icon: 'product' },
        { label: 'View Categories', href: '/admin/categories', icon: 'category' },
        { label: 'View Pages', href: '/admin/pages', icon: 'page' },
        { label: 'View Orders', href: '/admin/orders', icon: 'order' },
      ]);
      return;
    }
    const q = query.toLowerCase();
    const allResults: SearchResult[] = [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'page' },
      { label: 'New Product', href: '/admin/products/new', icon: 'product' },
      { label: 'New Category', href: '/admin/categories/new', icon: 'category' },
      { label: 'New Page', href: '/admin/pages/new', icon: 'page' },
      { label: 'New Banner', href: '/admin/banners/new', icon: 'page' },
      { label: 'View Products', href: '/admin/products', icon: 'product' },
      { label: 'View Categories', href: '/admin/categories', icon: 'category' },
      { label: 'View Pages', href: '/admin/pages', icon: 'page' },
      { label: 'View Menus', href: '/admin/menus', icon: 'page' },
      { label: 'View Media', href: '/admin/media', icon: 'page' },
      { label: 'View Orders', href: '/admin/orders', icon: 'order' },
      { label: 'View Customers', href: '/admin/customers', icon: 'page' },
      { label: 'View Sections', href: '/admin/sections', icon: 'page' },
      { label: 'View Settings', href: '/admin/settings', icon: 'page' },
    ];
    setResults(allResults.filter((r) => r.label.toLowerCase().includes(q)));
    setSelectedIndex(0);
  }, [query]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].href);
          setOpen(false);
        }
      }
    },
    [results, selectedIndex, router],
  );
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {' '}
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />{' '}
      <div className="bg-background relative z-10 w-full max-w-lg rounded-lg border shadow-2xl">
        {' '}
        <div className="flex items-center border-b px-4">
          {' '}
          <Search className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />{' '}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, products, categories..."
            className="placeholder:text-muted-foreground flex h-12 w-full bg-transparent text-sm outline-none"
          />{' '}
          <kbd className="bg-muted text-muted-foreground hidden shrink-0 rounded border px-1.5 text-xs md:inline-block">
            {' '}
            ESC{' '}
          </kbd>{' '}
        </div>{' '}
        {results.length > 0 && (
          <div className="max-h-72 overflow-y-auto p-2">
            {' '}
            {results.map((result, idx) => {
              const Icon = iconMap[result.icon];
              return (
                <button
                  key={result.href}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-full px-3 py-2 text-sm ${idx === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    router.push(result.href);
                    setOpen(false);
                  }}
                >
                  {' '}
                  <Icon className="text-muted-foreground h-4 w-4" /> {result.label}{' '}
                </button>
              );
            })}{' '}
          </div>
        )}{' '}
        {results.length === 0 && query && (
          <div className="text-muted-foreground px-6 py-8 text-center text-sm">
            {' '}
            No results found{' '}
          </div>
        )}{' '}
      </div>{' '}
    </div>
  );
}
