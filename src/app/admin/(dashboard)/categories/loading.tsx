import { PageHeader } from '@/components/admin/page-header';
export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader title="Categories" description="Organize your products into categories" />{' '}
      <div className="bg-muted h-64 animate-pulse rounded-lg" />{' '}
    </div>
  );
}
