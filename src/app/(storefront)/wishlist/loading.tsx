import { Skeleton } from '@/components/ui/skeleton';
export default function WishlistLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {' '}
      <div className="mb-8 flex items-center justify-between">
        {' '}
        <Skeleton className="h-9 w-56" /> <Skeleton className="h-10 w-24" />{' '}
      </div>{' '}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {' '}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            {' '}
            <Skeleton className="aspect-square w-full rounded-lg" />{' '}
            <Skeleton className="h-4 w-3/4" /> <Skeleton className="h-4 w-1/2" />{' '}
          </div>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
