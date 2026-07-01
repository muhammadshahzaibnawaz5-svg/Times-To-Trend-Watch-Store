'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { sectionSchema } from '@/schemas/section-schema';
import { sectionSettingsSchemas } from '@/sections/settings-schemas';
import { SectionService } from '@/services/section-service';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult } from '@/types/common';
import type { Section } from '@/types/section';

export async function getAllSections() {
  return createServiceAction(SectionService, 'getAll');
}

export async function getActiveSections() {
  return createServiceAction(SectionService, 'getActive');
}

export async function getSectionById(id: string) {
  return createServiceAction(SectionService, 'getById', id);
}

export async function toggleSectionActive(id: string): Promise<ActionResult<Section>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new SectionService(supabase);
  const result = await service.toggleActive(id);
  if (!result.error) revalidatePath('/admin/sections');
  return result;
}

export async function reorderSections(items: { id: string; sort_order: number }[]): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new SectionService(supabase);
  const result = await service.reorder(items);
  if (!result.error) revalidatePath('/admin/sections');
  return result;
}

export async function createSection(formData: FormData): Promise<ActionResult<Section>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new SectionService(supabase);

  const type = formData.get('type') as string;
  let settings: Record<string, unknown> = {};
  try {
    const raw = formData.get('settings');
    settings = raw ? JSON.parse(raw as string) : {};
  } catch {
    return { data: null, error: 'Invalid settings JSON' };
  }

  const settingsSchema = sectionSettingsSchemas[type as keyof typeof sectionSettingsSchemas];
  if (settingsSchema) {
    const parsedSettings = settingsSchema.safeParse(settings);
    if (!parsedSettings.success) {
      return { data: null, error: parsedSettings.error.errors[0].message };
    }
    settings = parsedSettings.data as Record<string, unknown>;
  }

  const parsed = sectionSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    isActive: formData.get('isActive') === 'true',
    sortOrder: Number(formData.get('sortOrder')) || 0,
    settings,
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const result = await service.create({
    name: parsed.data.name,
    type: parsed.data.type,
    title: parsed.data.title || null,
    subtitle: parsed.data.subtitle || null,
    settings: parsed.data.settings as any,
    is_active: parsed.data.isActive,
    sort_order: parsed.data.sortOrder,
  });

  if (!result.error) {
    revalidatePath('/admin/sections');
    revalidatePath('/');
  }
  return result;
}

export async function updateSection(id: string, formData: FormData): Promise<ActionResult<Section>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new SectionService(supabase);

  const type = formData.get('type') as string;
  let settings: Record<string, unknown> = {};
  try {
    const raw = formData.get('settings');
    settings = raw ? JSON.parse(raw as string) : {};
  } catch {
    return { data: null, error: 'Invalid settings JSON' };
  }

  const settingsSchema = sectionSettingsSchemas[type as keyof typeof sectionSettingsSchemas];
  if (settingsSchema) {
    const parsedSettings = settingsSchema.safeParse(settings);
    if (!parsedSettings.success) {
      return { data: null, error: parsedSettings.error.errors[0].message };
    }
    settings = parsedSettings.data as Record<string, unknown>;
  }

  const parsed = sectionSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    isActive: formData.get('isActive') === 'true',
    sortOrder: Number(formData.get('sortOrder')) || 0,
    settings,
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const result = await service.update(id, {
    name: parsed.data.name,
    type: parsed.data.type,
    title: parsed.data.title || null,
    subtitle: parsed.data.subtitle || null,
    settings: parsed.data.settings as any,
    is_active: parsed.data.isActive,
    sort_order: parsed.data.sortOrder,
  });

  if (!result.error) {
    revalidatePath('/admin/sections');
    revalidatePath('/');
  }
  return result;
}

export async function deleteSection(id: string): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new SectionService(supabase);
  const result = await service.delete(id);
  if (!result.error) {
    revalidatePath('/admin/sections');
    revalidatePath('/');
  }
  return result;
}
