import { PageHeader } from '@/components/admin/page-header';
export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader title="Products" description="Manage your product catalog" />{' '}
      <div className="space-y-4">
        {' '}
        <div className="bg-muted h-10 w-full animate-pulse rounded-md" />{' '}
        <div className="bg-muted h-64 animate-pulse rounded-lg" />{' '}
      </div>{' '}
    </div>
  );
}
