'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { PageService } from '@/services/page-service';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult, PaginatedResult } from '@/types/common';
import type { Page } from '@/types/page';
import type { CreatePageInput } from '@/schemas/page-schema';

export async function getPagesAdmin(page?: number, pageSize?: number): Promise<PaginatedResult<Page>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new PageService(supabase);
  return service.getAllAdmin(page, pageSize);
}

export async function createPage(data: CreatePageInput): Promise<ActionResult<Page>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new PageService(supabase);

  const result = await service.create({
    title: data.title,
    slug: data.slug,
    content: data.content as any,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    template: data.template,
    is_published: data.is_published,
    sort_order: data.sort_order,
  });

  if (!result.error) revalidatePath('/admin/pages');
  return result;
}

export async function updatePage(id: string, data: CreatePageInput): Promise<ActionResult<Page>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new PageService(supabase);

  const result = await service.update(id, {
    title: data.title,
    slug: data.slug,
    content: data.content as any,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    template: data.template,
    is_published: data.is_published,
    sort_order: data.sort_order,
  });

  if (!result.error) revalidatePath('/admin/pages');
  return result;
}

export async function togglePageStatus(id: string): Promise<ActionResult<Page>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new PageService(supabase);
  const result = await service.togglePublish(id);
  if (!result.error) revalidatePath('/admin/pages');
  return result;
}

export async function deletePage(id: string): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new PageService(supabase);
  const result = await service.delete(id);
  if (!result.error) revalidatePath('/admin/pages');
  return result;
}

export async function getPageBySlug(slug: string) {
  return createServiceAction(PageService, 'getBySlug', slug);
}

export async function getPublishedPages() {
  return createServiceAction(PageService, 'getAllPublished');
}
