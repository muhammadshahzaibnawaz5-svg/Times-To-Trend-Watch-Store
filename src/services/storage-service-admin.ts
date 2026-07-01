import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult } from '@/types/common';

export class StorageServiceAdmin {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async upload(
    bucket: string,
    path: string,
    file: File,
  ): Promise<ActionResult<string>> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) return { data: null, error: error.message };

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { data: urlData.publicUrl, error: null };
  }

  async deleteFile(bucket: string, path: string): Promise<ActionResult<null>> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  }

  async deleteFiles(bucket: string, paths: string[]): Promise<ActionResult<null>> {
    const { error } = await this.supabase.storage.from(bucket).remove(paths);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  }
}
