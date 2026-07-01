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
  const supabase = createAdminClient();
  const service = new BannerService(supabase);
  return service.getAllAdmin(params);
}

export async function getActiveBanners() {
  return createServiceAction(BannerService, 'getActive');
}

export async function getBannerById(id: string) {
  return createServiceAction(BannerService, 'getById', id);
}

export async function createBanner(formData: FormData): Promise<ActionResult<Banner>> {
  console.log('[createBanner] called');
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new BannerService(supabase);

    const imageUrl = formData.get('imageUrl') as string;
    if (!imageUrl) {
      return { data: null, error: 'Image URL is required' };
    }

    const result = await service.create({
      title: (formData.get('title') as string) || 'Hero Banner',
      subtitle: (formData.get('subtitle') as string) || null,
      image_url: imageUrl,
      button_text: (formData.get('button_text') as string) || null,
      button_link: (formData.get('button_link') as string) || null,
      is_active: formData.get('is_active') === 'false' ? false : true,
      sort_order: Number(formData.get('sort_order')) || 0,
    });

    if (!result.error) {
      revalidatePath('/admin/banners');
      revalidatePath('/');
    }
    return result;
  } catch (err) {
    const msg = `[createBanner] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}

export async function updateBanner(id: string, formData: FormData): Promise<ActionResult<Banner>> {
  console.log('[updateBanner] called id=', id);
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new BannerService(supabase);

    const updates: Record<string, unknown> = {};
    const imageUrl = formData.get('imageUrl') as string;
    if (imageUrl) updates.image_url = imageUrl;
    const title = formData.get('title') as string;
    if (title) updates.title = title;
    const subtitle = formData.get('subtitle') as string;
    if (subtitle) updates.subtitle = subtitle;
    const buttonText = formData.get('button_text') as string;
    if (buttonText) updates.button_text = buttonText;
    const buttonLink = formData.get('button_link') as string;
    if (buttonLink) updates.button_link = buttonLink;
    if (formData.has('is_active')) updates.is_active = formData.get('is_active') === 'true';
    if (formData.has('sort_order')) updates.sort_order = Number(formData.get('sort_order'));

    const result = await service.update(id, updates as any);

    if (!result.error) {
      revalidatePath('/admin/banners');
      revalidatePath('/');
    }
    return result;
  } catch (err) {
    const msg = `[updateBanner] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult<null>> {
  console.log('[deleteBanner] called id=', id);
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new BannerService(supabase);
    const result = await service.delete(id);
    if (!result.error) {
      revalidatePath('/admin/banners');
      revalidatePath('/');
    }
    return result;
  } catch (err) {
    const msg = `[deleteBanner] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}
