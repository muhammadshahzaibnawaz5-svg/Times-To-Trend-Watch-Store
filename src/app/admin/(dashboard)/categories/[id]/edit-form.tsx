'use client';

import { updateCategory } from '@/actions/category-actions';
import { useAdminForm } from '@/hooks/use-admin-form';
import { CategoryForm, type CategoryFormValues } from '../category-form';
import type { Category } from '@/types/category';

interface EditCategoryFormProps {
  category: Category;
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const { pending, handleSubmit } = useAdminForm<CategoryFormValues, Category>({
    submitAction: (data) => updateCategory(category.id, data),
    successMessage: 'Category updated successfully',
    redirectTo: '/admin/categories',
  });

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      pending={pending}
      defaultValues={{
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        is_active: category.is_active,
        sort_order: category.sort_order,
        image_url: category.image_url ?? '',
      }}
    />
  );
}
