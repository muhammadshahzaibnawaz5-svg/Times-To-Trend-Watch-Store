'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createMenu } from '@/actions/menu-actions';
import { MenuForm, type MenuFormValues } from '../menu-form';
export default function NewMenuPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handleSubmit(data: MenuFormValues) {
    setPending(true);
    const result = await createMenu({ name: data.name, location: data.location, items: [] });
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Menu created successfully');
      router.push(`/admin/menus/${result.data!.id}`);
    }
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {' '}
      <h1 className="text-3xl font-bold">New Menu</h1>{' '}
      <MenuForm onSubmit={handleSubmit} pending={pending} />{' '}
    </div>
  );
}
