'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateMenu } from '@/actions/menu-actions';
import { MenuForm, type MenuFormValues } from '../menu-form';
import { MenuBuilder } from '@/components/admin/menu-builder';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/types/menu';

interface EditMenuClientProps {
  menu: {
    id: string;
    name: string;
    location: string;
    items: MenuItem[];
  };
}

export function EditMenuClient({ menu }: EditMenuClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(menu.items || []);

  async function handleSubmit(data: MenuFormValues) {
    setPending(true);
    const result = await updateMenu(menu.id, {
      ...data,
      items,
    });
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Menu updated successfully');
      router.refresh();
    }
  }

  async function handleSave() {
    setPending(true);
    const result = await updateMenu(menu.id, {
      name: menu.name,
      location: menu.location as any,
      items,
    });
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Menu items saved');
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Edit Menu: {menu.name}</h1>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Menu Settings</h2>
        <MenuForm
          onSubmit={handleSubmit}
          pending={pending}
          defaultValues={{
            name: menu.name,
            location: menu.location as any,
          }}
        />
      </div>

      <div className="rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu Items</h2>
          <Button onClick={handleSave} disabled={pending}>
            {pending ? 'Saving...' : 'Save Items'}
          </Button>
        </div>
        <MenuBuilder items={items} onItemsChange={setItems} />
      </div>
    </>
  );
}
