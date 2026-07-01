'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createCategory } from '@/actions/category-actions';
import { CategoryForm, type CategoryFormValues } from '../category-form';
export default function NewCategoryPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handleSubmit(data: CategoryFormValues) {
    setPending(true);
    const result = await createCategory(data);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Category created successfully');
      router.push('/admin/categories');
    }
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {' '}
      <h1 className="text-3xl font-bold">New Category</h1>{' '}
      <CategoryForm onSubmit={handleSubmit} pending={pending} />{' '}
    </div>
  );
}
