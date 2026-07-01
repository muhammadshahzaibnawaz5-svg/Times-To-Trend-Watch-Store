import { createClient } from '@/lib/supabase/client';
import type { ActionResult } from '@/types/common';

export class StorageService {
  private supabase = createClient();

  async upload(
    bucket: string,
    path: string,
    file: File,
  ): Promise<ActionResult<string>> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) return { data: null, error: error.message };

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { data: urlData.publicUrl, error: null };
  }

  async delete(bucket: string, path: string): Promise<ActionResult<null>> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  }
}
