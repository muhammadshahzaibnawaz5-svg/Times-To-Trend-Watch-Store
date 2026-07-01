'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  LayoutDashboard,
  Package,
  ListTree,
  Image,
  Layout,
  ShoppingCart,
  Settings,
  FileText,
  Menu,
  Library,
} from 'lucide-react';
const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: ListTree },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/menus', label: 'Menus', icon: MenuIcon },
  { href: '/admin/media', label: 'Media', icon: Library },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/sections', label: 'Sections', icon: Layout },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];
function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 p-4">
      {' '}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {' '}
            <Icon className="h-4 w-4" /> {item.label}{' '}
          </Link>
        );
      })}{' '}
    </nav>
  );
}
export function AdminSidebar() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (isDesktop) {
    return (
      <aside className="bg-background flex w-64 flex-col border-r">
        {' '}
        <div className="flex h-14 items-center border-b px-6 font-bold"> Times to Trend </div>{' '}
        <SidebarNav />{' '}
      </aside>
    );
  }
  return (
    <Sheet>
      {' '}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-3 left-2 z-40 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        {' '}
        <div className="flex h-14 items-center border-b px-6 font-bold"> Times to Trend </div>{' '}
        <SidebarNav />{' '}
      </SheetContent>{' '}
    </Sheet>
  );
}
