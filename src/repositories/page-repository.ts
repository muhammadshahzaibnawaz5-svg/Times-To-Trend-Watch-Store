import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Page, PageInsert, PageUpdate } from '@/types/page';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { BaseRepository } from './base-repository';

export class PageRepository extends BaseRepository<Page> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'pages');
  }

  async findBySlug(slug: string): Promise<ActionResult<Page>> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as unknown as Page, error: null };
  }

  async findPublished(): Promise<ActionResult<Page[]>> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as Page[], error: null };
  }

  async findAllAdmin(page?: number, pageSize = 20): Promise<PaginatedResult<Page>> {
    return this.findAllPaginated({
      page,
      pageSize,
      columns: '*',
      orderBy: { column: 'sort_order', ascending: true },
    });
  }

  async createPage(page: PageInsert): Promise<ActionResult<Page>> {
    return this.insert(page as unknown as Partial<Page>);
  }

  async updatePage(id: string, page: PageUpdate): Promise<ActionResult<Page>> {
    return this.update(id, page as unknown as Partial<Page>);
  }
}
