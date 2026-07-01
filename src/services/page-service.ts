import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Page, PageInsert, PageUpdate } from '@/types/page';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { PageRepository } from '@/repositories/page-repository';

export class PageService {
  private repository: PageRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new PageRepository(supabase);
  }

  async getAllAdmin(page?: number, pageSize?: number): Promise<PaginatedResult<Page>> {
    return this.repository.findAllAdmin(page, pageSize);
  }

  async getAllPublished(): Promise<ActionResult<Page[]>> {
    return this.repository.findPublished();
  }

  async getBySlug(slug: string): Promise<ActionResult<Page>> {
    return this.repository.findBySlug(slug);
  }

  async getById(id: string): Promise<ActionResult<Page>> {
    return this.repository.findById(id);
  }

  async create(page: PageInsert): Promise<ActionResult<Page>> {
    return this.repository.createPage(page);
  }

  async update(id: string, page: PageUpdate): Promise<ActionResult<Page>> {
    return this.repository.updatePage(id, page);
  }

  async togglePublish(id: string): Promise<ActionResult<Page>> {
    const { data: current } = await this.repository.findById(id);
    if (!current) return { data: null, error: 'Page not found' };
    return this.repository.updatePage(id, { is_published: !current.is_published } as PageUpdate);
  }

  async delete(id: string): Promise<ActionResult<null>> {
    return this.repository.delete(id);
  }
}
