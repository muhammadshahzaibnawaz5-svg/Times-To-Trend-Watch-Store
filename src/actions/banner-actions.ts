'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { bannerSchema } from '@/schemas/banner-schema';
import { BannerService } from '@/services/banner-service';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult, PaginatedResult } from '@/types/common';
import type { Banner } from '@/types/banner';
import type { AdminBannerParams } from '@/repositories/banner-repository';

export async function getAllBanners() {
  return createServiceAction(BannerService, 'getAll');
}

export async function getAllBannersAdmin(params?: AdminBannerParams): Promise<PaginatedResult<Banner>> {
  await requireAdmin();
  return createServiceAction(BannerService, 'getAllAdmin', params);
}

export async function getActiveBanners() {
  return createServiceAction(BannerService, 'getActive');
}

export async function getBannerById(id: string) {
  return createServiceAction(BannerService, 'getById', id);
}

export async function createBanner(formData: FormData): Promise<ActionResult<Banner>> {
  console.log('[createBanner] called');
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new BannerService(supabase);

  const parsed = bannerSchema.safeParse({
    imageUrl: formData.get('imageUrl'),
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const result = await service.create({
    title: 'Hero Banner',
    subtitle: null,
    image_url: parsed.data.imageUrl,
    button_text: null,
    button_link: null,
    is_active: true,
    sort_order: 0,
  });

  if (!result.error) revalidatePath('/admin/banners');
  return result;
}

export async function updateBanner(id: string, formData: FormData): Promise<ActionResult<Banner>> {
  console.log('[updateBanner] called id=', id);
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new BannerService(supabase);

  const parsed = bannerSchema.safeParse({
    imageUrl: formData.get('imageUrl'),
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const result = await service.update(id, {
    image_url: parsed.data.imageUrl,
  });

  if (!result.error) revalidatePath('/admin/banners');
  return result;
}

export async function deleteBanner(id: string): Promise<ActionResult<null>> {
  console.log('[deleteBanner] called id=', id);
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new BannerService(supabase);
  const result = await service.delete(id);
  if (!result.error) revalidatePath('/admin/banners');
  return result;
}
