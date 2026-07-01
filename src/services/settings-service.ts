import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult } from '@/types/common';

export class SettingsService {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async getAll() {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*')
      .order('key');
    return { data, error: error?.message || null };
  }

  async update(key: string, value: unknown): Promise<ActionResult<null>> {
    const { error } = await this.supabase
      .from('settings')
      .update({ value } as never)
      .eq('key', key);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  }
}
