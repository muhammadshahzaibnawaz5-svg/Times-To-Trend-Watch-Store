import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Banner, BannerInsert, BannerUpdate } from '@/types/banner';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { BannerRepository, type AdminBannerParams } from '@/repositories/banner-repository';
import { StorageServiceAdmin } from '@/services/storage-service-admin';

export class BannerService {
  private repository: BannerRepository;
  private storage: StorageServiceAdmin;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new BannerRepository(supabase);
    this.storage = new StorageServiceAdmin(supabase);
  }

  async getAll(options?: {
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<ActionResult<Banner[]>> {
    return this.repository.findAll({
      orderBy: options?.orderBy || { column: 'sort_order', ascending: true },
    });
  }

  async getAllAdmin(params?: AdminBannerParams): Promise<PaginatedResult<Banner>> {
    return this.repository.findAllAdmin(params);
  }

  async getById(id: string): Promise<ActionResult<Banner>> {
    return this.repository.findById(id);
  }

  async getActive(): Promise<ActionResult<Banner[]>> {
    return this.repository.findActive();
  }

  async create(banner: BannerInsert): Promise<ActionResult<Banner>> {
    return this.repository.create(banner);
  }

  async update(id: string, banner: BannerUpdate): Promise<ActionResult<Banner>> {
    return this.repository.updateBanner(id, banner);
  }

  async delete(id: string): Promise<ActionResult<null>> {
    const { data: banner } = await this.repository.findById(id);
    if (banner?.image_url?.includes('supabase.co')) {
      const path = banner.image_url.split('/').pop();
      if (path) {
        await this.storage.deleteFile('banners', path);
      }
    }
    return this.repository.delete(id);
  }
}
