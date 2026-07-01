'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTransition, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteMenu } from '@/actions/menu-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
interface MenuRow {
  id: string;
  name: string;
  location: string;
  items: any[];
}
interface MenusListProps {
  menus: MenuRow[];
}
export function MenusList({ menus }: MenusListProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  async function handleDelete(id: string) {
    setDeleting(true);
    const result = await deleteMenu(id);
    setDeleting(false);
    setDeleteId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Menu deleted');
      startTransition(() => router.refresh());
    }
  }
  if (menus.length === 0) {
    return (
      <EmptyState
        title="No menus found"
        description="Create your first navigation menu to control the store navigation."
        action={
          <Button asChild>
            <Link href="/admin/menus/new">Add Menu</Link>
          </Button>
        }
      />
    );
  }
  return (
    <>
      {' '}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {' '}
        {menus.map((menu) => (
          <Card key={menu.id}>
            {' '}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {' '}
              <CardTitle className="text-lg font-semibold">{menu.name}</CardTitle>{' '}
              <div className="flex gap-1">
                {' '}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/menus/${menu.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(menu.id)}>
                  {' '}
                  <Trash2 className="text-destructive h-4 w-4" />{' '}
                </Button>{' '}
              </div>{' '}
            </CardHeader>{' '}
            <CardContent>
              {' '}
              <p className="text-muted-foreground text-sm capitalize">
                {' '}
                Location: {menu.location.replace('-', ' ')}{' '}
              </p>{' '}
              <p className="text-muted-foreground mt-1 text-xs">
                {' '}
                {menu.items.length} menu item{menu.items.length !== 1 ? 's' : ''}{' '}
              </p>{' '}
            </CardContent>{' '}
          </Card>
        ))}{' '}
      </div>{' '}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Menu"
        description="Are you sure you want to delete this menu? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={async () => {
          if (deleteId) await handleDelete(deleteId);
        }}
      />{' '}
    </>
  );
}
