'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { CategoryService } from '@/services/category-service';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult, PaginatedResult } from '@/types/common';
import type { Category } from '@/types/category';
import type { AdminCategoryParams } from '@/repositories/category-repository';
import type { CategoryFormValues } from '@/app/admin/(dashboard)/categories/category-form';

export async function getCategoriesAdmin(params?: AdminCategoryParams): Promise<PaginatedResult<Category>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  return service.getAllAdmin(params);
}

export async function createCategory(data: CategoryFormValues): Promise<ActionResult<Category>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);

  const result = await service.create({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    is_active: data.is_active,
    sort_order: data.sort_order,
    image_url: data.image_url || null,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    seo_keywords: data.seo_keywords || null,
    og_image: data.og_image || null,
  });

  if (!result.error) revalidatePath('/admin/categories');
  return result;
}

export async function updateCategory(id: string, data: CategoryFormValues): Promise<ActionResult<Category>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);

  const result = await service.update(id, {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    is_active: data.is_active,
    sort_order: data.sort_order,
    image_url: data.image_url || null,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    seo_keywords: data.seo_keywords || null,
    og_image: data.og_image || null,
  });

  if (!result.error) revalidatePath('/admin/categories');
  return result;
}

export async function toggleCategoryActive(id: string): Promise<ActionResult<Category>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  const result = await service.toggleActive(id);
  if (!result.error) revalidatePath('/admin/categories');
  return result;
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  const result = await service.delete(id);
  if (!result.error) revalidatePath('/admin/categories');
  return result;
}

export async function getAllCategories() {
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  return service.getAll();
}

export async function getActiveCategories() {
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  return service.getActive();
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  return service.getBySlug(slug);
}

export async function getCategoryById(id: string) {
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  return service.getById(id);
}

export async function reorderCategories(items: { id: string; sort_order: number }[]): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new CategoryService(supabase);
  const result = await service.reorder(items);
  if (!result.error) revalidatePath('/admin/categories');
  return result;
}
