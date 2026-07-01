import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { CategoryService } from '@/services/category-service';
import { EditCategoryForm } from './edit-form';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createServerClient();
  const service = new CategoryService(supabase);
  const { data: category } = await service.getById(id);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Category</h1>
      <EditCategoryForm category={category} />
    </div>
  );
}
