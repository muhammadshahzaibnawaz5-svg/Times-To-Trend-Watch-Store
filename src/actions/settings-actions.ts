'use server';

import { revalidatePath } from 'next/cache';
import { createServiceAction } from '@/lib/create-service-action';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { SettingsService } from '@/services/settings-service';
import type { ActionResult } from '@/types/common';

export async function getAllSettings() {
  return createServiceAction(SettingsService, 'getAll');
}

export async function updateSetting(
  key: string,
  value: unknown,
): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = await createServerClient();
  const service = new SettingsService(supabase);
  return service.update(key, value);
}
