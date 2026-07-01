'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, ShoppingBag, Watch, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';

interface NavLink {
  href: string;
  label: string;
  children?: NavLink[];
}

interface SiteHeaderProps {
  storeName?: string;
  navLinks?: NavLink[];
  announcement?: string[];
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Home',
    children: [
      { href: '/products?sort=newest', label: 'New Arrivals' },
      { href: '/#featured', label: 'Featured Watches' },
      { href: '/contact', label: 'Contact Us' },
    ],
  },
  {
    href: '/products',
    label: 'Products',
    children: [
      { href: '/products', label: 'All Watches' },
      { href: '/categories/dress', label: 'Dress Watches' },
      { href: '/categories/sports', label: 'Sport Watches' },
      { href: '/categories/automatic', label: 'Automatic' },
    ],
  },
  { href: '/contact', label: 'Contact Us' },
];

const DEFAULT_DROPDOWN_CHILDREN: Record<string, NavLink[]> = {
  '/': [
    { href: '/new-arrivals', label: 'New Arrivals' },
    { href: '/featured-watches', label: 'Featured Watches' },
    { href: '/contact', label: 'Contact Us' },
  ],
  '/products': [
    { href: '/products', label: 'All Watches' },
    { href: '/categories/dress', label: 'Dress Watches' },
    { href: '/categories/sports', label: 'Sport Watches' },
    { href: '/categories/automatic', label: 'Automatic' },
  ],
};

const DEFAULT_ANNOUNCEMENT = ['Its Times To Trend'];

export function SiteHeader({
  storeName = 'Times to Trend',
  navLinks = DEFAULT_NAV_LINKS,
  announcement = DEFAULT_ANNOUNCEMENT,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  function handleDropdownEnter(id: string) {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setOpenDropdown(id);
  }

  function handleDropdownLeave() {
    hideTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  const announcementText = announcement.join(' / ');

  return (
    <div ref={headerRef} className="sticky top-0 z-50 w-full">
      <div className="bg-foreground text-background overflow-hidden py-2">
        <div className="flex items-center justify-center px-4 text-[11px] font-semibold uppercase">
          <span className="animate-text-shimmer bg-gradient-to-r from-white via-white/55 to-white bg-[length:200%_100%] bg-clip-text text-transparent">
            {announcementText}
          </span>
        </div>
      </div>

      <header
        className={cn(
          'bg-background/95 supports-[backdrop-filter]:bg-background/82 w-full border-b backdrop-blur transition-shadow duration-300',
          scrolled && 'shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
        )}
      >
        <div className="container mx-auto flex h-16 items-center px-4 md:h-[4.5rem]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span className="border-foreground bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-md border">
              <Watch className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="hidden flex-col sm:flex">
              <span className="text-sm leading-none font-bold uppercase">{storeName}</span>
              <span className="text-muted-foreground mt-1 text-[11px] leading-none font-medium uppercase">
                Fine Timepieces
              </span>
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              const dropdownChildren = link.children?.length
                ? link.children
                : DEFAULT_DROPDOWN_CHILDREN[link.href];
              const hasChildren = dropdownChildren && dropdownChildren.length > 0;

              if (hasChildren) {
                const isOpen = openDropdown === link.href;
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.href)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'relative flex items-center gap-1.5 py-2 text-sm font-semibold uppercase transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')}
                        strokeWidth={1.5}
                      />
                      <span
                        className={cn(
                          'bg-foreground absolute -bottom-0.5 left-0 h-px w-full transition-transform duration-300',
                          isActive || isOpen ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </Link>

                    {isOpen && (
                      <div
                        onMouseEnter={() => handleDropdownEnter(link.href)}
                        onMouseLeave={handleDropdownLeave}
                        className="absolute top-full left-0 z-50 pt-3"
                      >
                        <div className="border-border bg-background min-w-52 rounded-lg border p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
                          {dropdownChildren!.map((child) => {
                            const isChildActive =
                              child.href === '/'
                                ? pathname === '/'
                                : pathname.startsWith(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className={cn(
                                  'block rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                                  isChildActive
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-2 text-sm font-semibold uppercase transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'bg-foreground absolute -bottom-0.5 left-0 h-px w-full transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
            {searchOpen ? (
              <div className="animate-slide-in-right border-input bg-background focus-within:ring-ring flex items-center gap-1 rounded-md border px-3 shadow-sm focus-within:ring-1">
                <Search className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                <form onSubmit={handleSearch}>
                  <Input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search watches..."
                    className="h-9 w-44 border-0 bg-transparent px-2 text-sm ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-52"
                  />
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="h-10 w-10 rounded-md"
              >
                <Search className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            )}

            <Button variant="ghost" size="icon" asChild className="relative h-10 w-10 rounded-md">
              <Link href="/cart" aria-label={`Cart with ${itemCount} items`}>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                {mounted && itemCount > 0 && (
                  <span className="bg-foreground text-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] leading-none font-bold">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Menu className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background w-72 p-0">
                <SheetHeader className="border-b px-6 py-5">
                  <SheetTitle className="flex items-center gap-3 text-left">
                    <span className="border-foreground bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-md border">
                      <Watch className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm leading-none font-bold uppercase">{storeName}</span>
                      <span className="text-muted-foreground mt-1 text-[11px] leading-none font-medium uppercase">
                        Fine Timepieces
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-2 flex flex-col px-4">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                    const dropdownChildren = link.children?.length
                      ? link.children
                      : DEFAULT_DROPDOWN_CHILDREN[link.href];
                    const hasChildren = dropdownChildren && dropdownChildren.length > 0;

                    if (hasChildren) {
                      return (
                        <div key={link.href} className="border-b">
                          <SheetClose asChild>
                            <Link
                              href={link.href}
                              className={cn(
                                'flex items-center gap-3 py-4 text-sm font-semibold uppercase transition-colors',
                                isActive
                                  ? 'text-foreground'
                                  : 'text-muted-foreground hover:text-foreground',
                              )}
                            >
                              {isActive && (
                                <span
                                  className="bg-foreground h-3 w-0.5 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span className={cn(!isActive && 'ml-3.5')}>{link.label}</span>
                            </Link>
                          </SheetClose>
                          <div className="border-border ml-4 space-y-1 border-l pb-3 pl-4">
                            {dropdownChildren!.map((child) => {
                              const isChildActive =
                                child.href === '/'
                                  ? pathname === '/'
                                  : pathname.startsWith(child.href);
                              return (
                                <SheetClose asChild key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                      isChildActive
                                        ? 'bg-muted text-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                </SheetClose>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center gap-3 border-b py-4 text-sm font-semibold uppercase transition-colors last:border-b-0',
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          {isActive && (
                            <span className="bg-foreground h-3 w-0.5 shrink-0" aria-hidden="true" />
                          )}
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                <div className="mt-4 border-t px-4 pt-4">
                  <SheetClose asChild>
                    <Link
                      href="/cart"
                      className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-md px-2 py-3 text-sm font-semibold uppercase transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                      Cart
                      {mounted && itemCount > 0 && (
                        <span className="bg-foreground text-background ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
