import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
export const ChartRevenue = dynamic(
  () => import('./chart-revenue').then((mod) => mod.ChartRevenue),
  {
    loading: () => (
      <div className="bg-card rounded-lg border p-6 shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        {' '}
        <Skeleton className="mb-4 h-6 w-48" /> <Skeleton className="h-[300px] w-full" />{' '}
      </div>
    ),
  },
);
