import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Banner, BannerInsert, BannerUpdate } from '@/types/banner';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { BaseRepository } from './base-repository';

type QueryBuilder = ReturnType<SupabaseClient<Database>['from']>;

export interface AdminBannerParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export class BannerRepository extends BaseRepository<Banner> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'banners');
  }

  async findActive(): Promise<ActionResult<Banner[]>> {
    const { data, error } = await this.supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as Banner[], error: null };
  }

  async findAllAdmin(params?: AdminBannerParams): Promise<PaginatedResult<Banner>> {
    return this.findAllPaginated({
      page: params?.page,
      pageSize: params?.pageSize || 20,
      orderBy: { column: 'sort_order', ascending: true },
      filters: (query) => {
        let q = query as any;
        if (params?.search) q = q.ilike('title', `%${params.search}%`);
        if (params?.isActive !== undefined) q = q.eq('is_active', params.isActive);
        return q as QueryBuilder;
      },
    });
  }

  async create(banner: BannerInsert): Promise<ActionResult<Banner>> {
    return this.insert(banner as unknown as Partial<Banner>);
  }

  async updateBanner(id: string, banner: BannerUpdate): Promise<ActionResult<Banner>> {
    return this.update(id, banner as unknown as Partial<Banner>);
  }
}
