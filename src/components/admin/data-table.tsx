'use client';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
export interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  keyExtractor: (item: T) => string;
}
function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr className="border-b last:border-0">
      {' '}
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          {' '}
          <div className="bg-muted h-4 w-full animate-pulse rounded" />{' '}
        </td>
      ))}{' '}
    </tr>
  );
}
export function DataTable<T>({
  columns,
  data,
  pageSize = 20,
  onRowClick,
  loading,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const handleSort = (colIndex: number) => {
    if (sortColumn === colIndex) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colIndex);
      setSortDirection('asc');
    }
  };
  const sorted = useMemo(() => {
    if (sortColumn === null) return data;
    const col = columns[sortColumn];
    if (!col || !col.sortable) return data;
    return [...data].sort((a, b) => {
      let aVal: unknown;
      let bVal: unknown;
      if (typeof col.accessorKey === 'function') {
        return 0;
      }
      aVal = a[col.accessorKey as keyof T];
      bVal = b[col.accessorKey as keyof T];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDirection, columns]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <div>
      {' '}
      <div className="overflow-x-auto rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        {' '}
        <table className="w-full text-sm">
          {' '}
          <thead>
            {' '}
            <tr className="bg-muted/50 border-b">
              {' '}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-4 py-3 text-left font-medium',
                    col.sortable && 'hover:bg-muted cursor-pointer select-none',
                    col.className,
                  )}
                  onClick={() => col.sortable && handleSort(idx)}
                >
                  {' '}
                  <div className="flex items-center gap-1">
                    {' '}
                    {col.header}{' '}
                    {col.sortable && (
                      <span className="text-muted-foreground">
                        {' '}
                        {sortColumn === idx ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3" />
                        )}{' '}
                      </span>
                    )}{' '}
                  </div>{' '}
                </th>
              ))}{' '}
            </tr>{' '}
          </thead>{' '}
          <tbody>
            {' '}
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={columns.length} />
              ))
            ) : paginated.length === 0 ? (
              <tr>
                {' '}
                <td
                  colSpan={columns.length}
                  className="text-muted-foreground px-4 py-8 text-center text-sm"
                >
                  {' '}
                  No data found{' '}
                </td>{' '}
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={cn(
                    'border-b last:border-0',
                    onRowClick && 'hover:bg-muted/50 cursor-pointer',
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {' '}
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn('px-4 py-3', col.className)}>
                      {' '}
                      {typeof col.accessorKey === 'function'
                        ? col.accessorKey(item)
                        : String(item[col.accessorKey as keyof T] ?? '')}{' '}
                    </td>
                  ))}{' '}
                </tr>
              ))
            )}{' '}
          </tbody>{' '}
        </table>{' '}
      </div>{' '}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          {' '}
          <p className="text-muted-foreground text-sm">
            {' '}
            Page {currentPage} of {totalPages}{' '}
          </p>{' '}
          <div className="flex gap-2">
            {' '}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              {' '}
              Previous{' '}
            </Button>{' '}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              {' '}
              Next{' '}
            </Button>{' '}
          </div>{' '}
        </div>
      )}{' '}
    </div>
  );
}
