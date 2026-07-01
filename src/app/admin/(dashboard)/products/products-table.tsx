'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Search } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { useState, useCallback, useEffect, useRef } from 'react';
import { deleteProduct } from '@/actions/product-actions';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
  categories: { name: string } | null;
}
interface ProductsTableProps {
  products: ProductRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  status: string;
}
export function ProductsTable({
  products,
  total,
  page,
  pageSize,
  search,
  status,
}: ProductsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 300);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const isFirstRender = useRef(true);
  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams],
  );
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(`${pathname}?${createQueryString({ search: debouncedSearch || null, page: '1' })}`);
  }, [debouncedSearch]);
  function handleStatusFilter(value: string) {
    router.push(`${pathname}?${createQueryString({ status: value || null, page: '1' })}`);
  }
  function handlePageChange(newPage: number) {
    router.push(`${pathname}?${createQueryString({ page: String(newPage) })}`);
  }
  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Product deleted');
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete product. It may have existing orders.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }
  const totalPages = Math.ceil(total / pageSize);
  const columns: Column<ProductRow>[] = [
    {
      header: 'Name',
      accessorKey: (item) => (
        <Link href={`/admin/products/${item.id}`} className="font-medium hover:underline">
          {' '}
          {item.name}{' '}
        </Link>
      ),
      sortable: true,
    },
    { header: 'Category', accessorKey: (item) => item.categories?.name || '-', sortable: true },
    { header: 'Price', accessorKey: (item) => `$${item.price}`, sortable: true },
    { header: 'Stock', accessorKey: 'stock_quantity' as keyof ProductRow, sortable: true },
    {
      header: 'Status',
      accessorKey: (item) => <StatusBadge status={item.status} />,
      sortable: false,
    },
    {
      header: 'Actions',
      accessorKey: (item) => (
        <div className="flex items-center gap-1">
          {' '}
          <Button variant="ghost" size="icon" asChild onClick={(e) => e.stopPropagation()}>
            <Link href={`/admin/products/${item.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(item.id);
            }}
          >
            {' '}
            <Trash2 className="text-destructive h-4 w-4" />{' '}
          </Button>{' '}
        </div>
      ),
      sortable: false,
      className: 'w-24',
    },
  ];
  return (
    <div className="space-y-4">
      {' '}
      <div className="flex gap-2">
        {' '}
        <div className="relative flex-1">
          {' '}
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />{' '}
          <Input
            placeholder="Search products... (auto-search)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />{' '}
        </div>{' '}
        <Select value={status} onValueChange={handleStatusFilter}>
          {' '}
          <SelectTrigger className="w-36">
            {' '}
            <SelectValue placeholder="All statuses" />{' '}
          </SelectTrigger>{' '}
          <SelectContent>
            {' '}
            <SelectItem value="">All Statuses</SelectItem>{' '}
            <SelectItem value="active">Active</SelectItem>{' '}
            <SelectItem value="inactive">Inactive</SelectItem>{' '}
            <SelectItem value="draft">Draft</SelectItem>{' '}
            <SelectItem value="archived">Archived</SelectItem>{' '}
          </SelectContent>{' '}
        </Select>{' '}
      </div>{' '}
      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => router.push(`/admin/products/${item.id}`)}
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
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={async () => {
          if (deleteId) await handleDelete(deleteId);
        }}
      />{' '}
    </div>
  );
}
