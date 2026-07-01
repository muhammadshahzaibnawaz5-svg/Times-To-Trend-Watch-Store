import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
type EmptyResultsProps = { title?: string; description?: string; showReset?: boolean };
export function EmptyResults({
  title = 'No products found',
  description = 'Try adjusting your filters or search terms.',
  showReset = true,
}: EmptyResultsProps) {
  return (
    <div className="bg-muted/30 flex flex-col items-center justify-center border px-6 py-16 text-center">
      {' '}
      <div className="bg-background mb-5 flex h-16 w-16 items-center justify-center rounded-md border cursor-pointer transition-shadow duration-300 hover:shadow-md">
        {' '}
        <PackageX className="text-muted-foreground h-8 w-8" />{' '}
      </div>{' '}
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>{' '}
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>{' '}
      {showReset && (
        <Button asChild variant="outline" className="mt-6">
          <Link href="/products">View All Products</Link>
        </Button>
      )}{' '}
    </div>
  );
}
