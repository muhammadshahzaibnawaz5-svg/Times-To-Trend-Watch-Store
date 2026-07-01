'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { MenuService } from '@/services/menu-service';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult } from '@/types/common';
import type { Menu } from '@/types/menu';
import type { CreateMenuInput } from '@/schemas/menu-schema';

export async function getMenus() {
  return createServiceAction(MenuService, 'getAll');
}

export async function getMenuByLocation(location: string) {
  return createServiceAction(MenuService, 'getByLocation', location);
}

export async function createMenu(data: CreateMenuInput): Promise<ActionResult<Menu>> {
  await requireAdmin();
  const supabase = await createServerClient();
  const service = new MenuService(supabase);

  const result = await service.create({
    name: data.name,
    location: data.location,
    items: data.items as any,
  });

  if (!result.error) revalidatePath('/admin/menus');
  return result;
}

export async function updateMenu(id: string, data: CreateMenuInput): Promise<ActionResult<Menu>> {
  await requireAdmin();
  const supabase = await createServerClient();
  const service = new MenuService(supabase);

  const result = await service.update(id, {
    name: data.name,
    location: data.location,
    items: data.items as any,
  });

  if (!result.error) revalidatePath('/admin/menus');
  return result;
}

export async function deleteMenu(id: string): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = await createServerClient();
  const service = new MenuService(supabase);
  const result = await service.delete(id);
  if (!result.error) revalidatePath('/admin/menus');
  return result;
}
