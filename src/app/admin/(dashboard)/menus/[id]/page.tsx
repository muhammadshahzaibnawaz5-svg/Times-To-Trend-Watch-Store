import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { MenuService } from '@/services/menu-service';
import { EditMenuClient } from './edit-menu-client';

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();
  const service = new MenuService(supabase);
  const { data: menu } = await service.getById(id);

  if (!menu) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <EditMenuClient menu={menu as any} />
    </div>
  );
}
