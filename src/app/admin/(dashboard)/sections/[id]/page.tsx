import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { EditSectionForm } from './edit-form';

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: section } = await supabase.from('sections').select('*').eq('id', id).single();

  if (!section) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Section</h1>
      <EditSectionForm section={section} />
    </div>
  );
}
