import { cn } from '@/lib/utils';
const statusColorMap: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  half_paid: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
  true: 'bg-green-100 text-green-800',
  false: 'bg-gray-100 text-gray-800',
};
interface StatusBadgeProps {
  status: string | boolean;
  label?: string;
  className?: string;
}
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const key = String(status);
  const colorClass = statusColorMap[key] || statusColorMap.active;
  const displayLabel = label ?? (typeof status === 'boolean' ? (status ? 'Yes' : 'No') : status);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        colorClass,
        className,
      )}
    >
      {' '}
      {displayLabel}{' '}
    </span>
  );
}
