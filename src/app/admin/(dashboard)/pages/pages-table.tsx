'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTransition, useState, useCallback } from 'react';
import { Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { togglePageStatus, deletePage } from '@/actions/page-actions';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
interface PageRow {
  id: string;
  title: string;
  slug: string;
  template: string;
  is_published: boolean;
  sort_order: number;
}
interface PagesTableProps {
  pages: PageRow[];
  total: number;
  page: number;
  pageSize: number;
}
export function PagesTable({ pages, total, page, pageSize }: PagesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [optimisticPublished, setOptimisticPublished] = useState<Record<string, boolean>>({});
  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) params.delete(key);
        else params.set(key, value);
      }
      return params.toString();
    },
    [searchParams],
  );
  function handlePageChange(newPage: number) {
    router.push(`${pathname}?${createQueryString({ page: String(newPage) })}`);
  }
  async function handleTogglePublish(id: string, currentPublished: boolean) {
    setOptimisticPublished((prev) => ({ ...prev, [id]: !currentPublished }));
    const result = await togglePageStatus(id);
    if (result.error) {
      setOptimisticPublished((prev) => ({ ...prev, [id]: currentPublished }));
      toast.error(result.error);
    } else {
      toast.success('Page status updated');
      startTransition(() => router.refresh());
    }
  }
  async function handleDelete(id: string) {
    setDeleting(true);
    const result = await deletePage(id);
    setDeleting(false);
    setDeleteId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Page deleted');
      startTransition(() => router.refresh());
    }
  }
  const columns: Column<PageRow>[] = [
    { header: 'Title', accessorKey: 'title', sortable: true },
    { header: 'Slug', accessorKey: 'slug', sortable: true },
    { header: 'Template', accessorKey: 'template', sortable: true },
    {
      header: 'Published',
      accessorKey: (item) => (
        <StatusBadge status={item.is_published} label={item.is_published ? 'Published' : 'Draft'} />
      ),
      sortable: true,
    },
    { header: 'Sort Order', accessorKey: 'sort_order', sortable: true },
    {
      header: 'Actions',
      accessorKey: (item) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {' '}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleTogglePublish(item.id, optimisticPublished[item.id] ?? item.is_published)
            }
          >
            {' '}
            {(optimisticPublished[item.id] ?? item.is_published) ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}{' '}
          </Button>{' '}
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/pages/${item.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
            {' '}
            <Trash2 className="text-destructive h-4 w-4" />{' '}
          </Button>{' '}
        </div>
      ),
      className: 'w-32',
    },
  ];
  const totalPages = Math.ceil(total / pageSize);
  return (
    <>
      {' '}
      <DataTable
        columns={columns}
        data={pages}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => router.push(`/admin/pages/${item.id}`)}
      />{' '}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          {' '}
          <p className="text-muted-foreground text-sm">
            {' '}
            Page {page} of {totalPages} ({total} total){' '}
          </p>{' '}
          <div className="flex gap-2">
            {' '}
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              {' '}
              Previous{' '}
            </Button>{' '}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              {' '}
              Next{' '}
            </Button>{' '}
          </div>{' '}
        </div>
      )}{' '}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Page"
        description="Are you sure you want to delete this page? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={async () => {
          if (deleteId) await handleDelete(deleteId);
        }}
      />{' '}
    </>
  );
}
