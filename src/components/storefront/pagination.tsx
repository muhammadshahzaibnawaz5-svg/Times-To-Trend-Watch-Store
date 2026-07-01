'use client';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
type PaginationProps = { currentPage: number; totalPages: number; paramName?: string };
export function Pagination({ currentPage, totalPages, paramName = 'page' }: PaginationProps) {
  const [page, setPage] = useQueryState(paramName, {
    defaultValue: '1',
    parse: (v) => v,
    serialize: (v) => v,
  });
  if (totalPages <= 1) return null;
  const handlePageChange = (newPage: number) => {
    setPage(newPage === 1 ? null : String(newPage));
  };
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {' '}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        {' '}
        <ChevronLeft className="h-4 w-4" /> Previous{' '}
      </Button>{' '}
      <div className="flex items-center gap-1">
        {' '}
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (currentPage <= 4) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = currentPage - 3 + i;
          }
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? 'default' : 'outline'}
              size="sm"
              className="h-10 w-10 p-0 min-w-[44px]"
              onClick={() => handlePageChange(pageNum)}
            >
              {' '}
              {pageNum}{' '}
            </Button>
          );
        })}{' '}
      </div>{' '}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        {' '}
        Next <ChevronRight className="h-4 w-4" />{' '}
      </Button>{' '}
    </div>
  );
}
