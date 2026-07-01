import { Skeleton } from '@/components/ui/skeleton';
export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {' '}
      <Skeleton className="mb-8 h-9 w-40" />{' '}
      <div className="grid gap-8 lg:grid-cols-3">
        {' '}
        <div className="space-y-6 lg:col-span-2">
          {' '}
          <div className="rounded-lg border p-6">
            {' '}
            <Skeleton className="mb-4 h-6 w-40" />{' '}
            <div className="grid gap-4 sm:grid-cols-2">
              {' '}
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={`h-10 ${i < 3 ? 'sm:col-span-2' : ''}`} />
              ))}{' '}
            </div>{' '}
          </div>{' '}
          <div className="space-y-3 rounded-lg border p-6">
            {' '}
            <Skeleton className="h-6 w-40" />{' '}
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}{' '}
          </div>{' '}
          <Skeleton className="h-10 w-full" />{' '}
        </div>{' '}
        <div className="space-y-4 rounded-lg border p-6">
          {' '}
          <Skeleton className="h-6 w-40" />{' '}
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}{' '}
          <Skeleton className="h-px w-full" /> <Skeleton className="h-4 w-full" />{' '}
          <Skeleton className="h-4 w-full" />{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
