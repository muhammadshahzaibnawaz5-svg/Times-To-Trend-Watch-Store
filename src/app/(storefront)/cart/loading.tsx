import { Skeleton } from '@/components/ui/skeleton';
export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {' '}
      <div className="mb-8 flex items-center justify-between">
        {' '}
        <Skeleton className="h-9 w-64" /> <Skeleton className="h-10 w-28" />{' '}
      </div>{' '}
      <div className="grid gap-8 lg:grid-cols-3">
        {' '}
        <div className="space-y-4 lg:col-span-2">
          {' '}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border p-4">
              {' '}
              <Skeleton className="h-24 w-24 rounded-md" />{' '}
              <div className="flex-1 space-y-3">
                {' '}
                <Skeleton className="h-5 w-2/3" /> <Skeleton className="h-4 w-1/3" />{' '}
                <div className="flex justify-between">
                  {' '}
                  <Skeleton className="h-8 w-28" /> <Skeleton className="h-6 w-24" />{' '}
                </div>{' '}
              </div>{' '}
            </div>
          ))}{' '}
        </div>{' '}
        <div className="rounded-lg border p-6">
          {' '}
          <Skeleton className="mb-4 h-6 w-40" />{' '}
          <div className="space-y-3">
            {' '}
            <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-full" />{' '}
            <Skeleton className="h-4 w-full" /> <Skeleton className="h-10 w-full" />{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
