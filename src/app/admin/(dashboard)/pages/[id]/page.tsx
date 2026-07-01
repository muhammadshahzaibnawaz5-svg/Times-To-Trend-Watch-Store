import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { PageService } from '@/services/page-service';
import { EditPageClient } from './edit-client';

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();
  const service = new PageService(supabase);
  const { data: page } = await service.getById(id);

  if (!page) notFound();

  return (
    <div className="space-y-6">
      <EditPageClient page={page as any} />
    </div>
  );
}
