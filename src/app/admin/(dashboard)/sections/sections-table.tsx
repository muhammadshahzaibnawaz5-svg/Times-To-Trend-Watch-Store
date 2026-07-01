'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { toggleSectionActive, reorderSections, deleteSection } from '@/actions/section-actions';
interface SectionRow {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  sort_order: number;
}
export function SectionsTable({ sections }: { sections: SectionRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<SectionRow | null>(null);
  async function handleToggleActive(id: string) {
    const result = await toggleSectionActive(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Section updated');
      startTransition(() => window.location.reload());
    }
  }
  async function handleSortChange(id: string, value: string) {
    const sortOrder = parseInt(value, 10);
    if (isNaN(sortOrder)) return;
    const result = await reorderSections([{ id, sort_order: sortOrder }]);
    if (result.error) {
      toast.error(result.error);
    } else {
      startTransition(() => window.location.reload());
    }
  }
  async function handleDelete(id: string) {
    const result = await deleteSection(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Section deleted');
      startTransition(() => router.refresh());
    }
    setDeleteTarget(null);
  }
  const columns: Column<SectionRow>[] = [
    { header: 'Name', accessorKey: 'name', sortable: true },
    {
      header: 'Type',
      accessorKey: (item) => <span className="capitalize">{item.type.replace(/_/g, ' ')}</span>,
      sortable: true,
    },
    {
      header: 'Active',
      accessorKey: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          {' '}
          <Switch
            checked={item.is_active}
            onCheckedChange={() => handleToggleActive(item.id)}
          />{' '}
        </div>
      ),
    },
    {
      header: 'Sort Order',
      accessorKey: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          {' '}
          <Input
            type="number"
            defaultValue={item.sort_order}
            className="h-8 w-20"
            onBlur={(e) => handleSortChange(item.id, e.target.value)}
          />{' '}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessorKey: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {' '}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/sections/${item.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(item)}>
            {' '}
            <Trash2 className="h-4 w-4" />{' '}
          </Button>{' '}
        </div>
      ),
    },
  ];
  return (
    <>
      {' '}
      <DataTable columns={columns} data={sections} keyExtractor={(item) => item.id} />{' '}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Section"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => (deleteTarget ? handleDelete(deleteTarget.id) : Promise.resolve())}
      />{' '}
    </>
  );
}
