'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { deleteBanner } from '@/actions/banner-actions';
import { EmptyState } from '@/components/admin/empty-state';
interface BannerRow {
  id: string;
  image_url: string | null;
}
interface BannersTableProps {
  banners: BannerRow[];
}
export function BannersTable({ banners }: BannersTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  async function handleDelete(id: string) {
    setDeleting(true);
    const result = await deleteBanner(id);
    setDeleting(false);
    setDeleteId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Banner deleted');
      router.refresh();
    }
  }
  if (banners.length === 0) {
    return (
      <EmptyState
        title="No banners"
        description="Upload your first hero banner image to get started."
      />
    );
  }
  return (
    <div className="space-y-4">
      {' '}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {' '}
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={`/admin/banners/${banner.id}`}
            className="group bg-muted hover:ring-primary relative block aspect-[16/9] overflow-hidden rounded-lg border transition-all hover:ring-2"
          >
            {' '}
            {banner.image_url ? (
              <img
                src={banner.image_url}
                alt="Hero banner"
                className="absolute inset-0 h-full w-full object-cover transition-all group-hover:scale-105"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                No image
              </div>
            )}{' '}
            <div className="absolute inset-0 flex items-end justify-center bg-black/0 p-2 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              {' '}
              <span className="text-xs font-medium text-white drop-shadow-sm">
                Click to replace
              </span>{' '}
            </div>{' '}
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeleteId(banner.id);
              }}
              className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {' '}
              <Trash2 className="h-4 w-4" />{' '}
            </Button>{' '}
          </Link>
        ))}{' '}
      </div>{' '}
      <p className="text-muted-foreground text-sm">
        {banners.length} banner{banners.length !== 1 ? 's' : ''} â€” click a banner to replace its
        image, or add a new one above.
      </p>{' '}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Banner"
        description="Are you sure you want to delete this banner image? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={async () => {
          if (deleteId) await handleDelete(deleteId);
        }}
      />{' '}
    </div>
  );
}
