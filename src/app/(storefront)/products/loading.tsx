import { Skeleton } from '@/components/ui/skeleton';
export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      {' '}
      <Skeleton className="mb-5 h-4 w-48" /> <Skeleton className="mb-10 h-8 w-64" />{' '}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {' '}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4 shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
            {' '}
            <Skeleton className="bg-muted aspect-square w-full rounded-md" />{' '}
            <Skeleton className="mt-4 h-4 w-1/3" /> <Skeleton className="mt-3 h-5 w-3/4" />{' '}
            <Skeleton className="mt-3 h-5 w-1/2" />{' '}
          </div>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
