import Link from 'next/link';
import { Plus, FileText, ListTree, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
const actions = [
  { href: '/admin/products/new', label: 'New Product', icon: Plus },
  { href: '/admin/pages/new', label: 'New Page', icon: FileText },
  { href: '/admin/categories/new', label: 'New Category', icon: ListTree },
  { href: '/admin/banners/new', label: 'New Banner', icon: Image },
];
export function QuickActionsWidget() {
  return (
    <div className="bg-card rounded-lg border p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {' '}
      <h3 className="mb-4 text-sm font-semibold">Quick Actions</h3>{' '}
      <div className="grid grid-cols-2 gap-2">
        {' '}
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto justify-start gap-2 py-3"
              asChild
            >
              <Link href={action.href}>
                <Icon className="h-4 w-4" /> {action.label}
              </Link>
            </Button>
          );
        })}{' '}
      </div>{' '}
    </div>
  );
}
