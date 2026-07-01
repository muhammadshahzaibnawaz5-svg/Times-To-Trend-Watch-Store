import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
type ProductGridProps = { children: ReactNode; className?: string };
export function ProductGrid({ children, className }: ProductGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-6 lg:grid-cols-4', className)}>
      {children}
    </div>
  );
}
