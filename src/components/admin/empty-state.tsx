import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}
export function EmptyState({
  icon,
  title = 'No data found',
  description = 'Get started by creating your first entry.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
      {' '}
      <div className="text-muted-foreground"> {icon || <Inbox className="h-12 w-12" />} </div>{' '}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>{' '}
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>{' '}
      {action && <div className="mt-4">{action}</div>}{' '}
    </div>
  );
}
