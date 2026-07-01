import type { ReactNode } from 'react';
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  loading?: boolean;
}
export function StatCard({ label, value, icon, loading }: StatCardProps) {
  if (loading) {
    return (
    <div className="bg-card rounded-lg border p-6 shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        {' '}
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />{' '}
        <div className="bg-muted mt-2 h-8 w-16 animate-pulse rounded" />{' '}
      </div>
    );
  }
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {' '}
      <div className="flex items-center justify-between">
        {' '}
        <p className="text-muted-foreground text-sm">{label}</p>{' '}
        {icon && <div className="text-muted-foreground">{icon}</div>}{' '}
      </div>{' '}
      <p className="mt-2 text-3xl font-bold">{value}</p>{' '}
    </div>
  );
}
