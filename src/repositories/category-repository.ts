import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Category, CategoryInsert, CategoryUpdate } from '@/types/category';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { BaseRepository } from './base-repository';

type QueryBuilder = ReturnType<SupabaseClient<Database>['from']>;

export interface AdminCategoryParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}

export class CategoryRepository extends BaseRepository<Category> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'categories');
  }

  async findBySlug(slug: string): Promise<ActionResult<Category>> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as unknown as Category, error: null };
  }

  async findActive(): Promise<ActionResult<Category[]>> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as Category[], error: null };
  }

  async findAllAdmin(params?: AdminCategoryParams): Promise<PaginatedResult<Category>> {
    return this.findAllPaginated({
      page: params?.page,
      pageSize: params?.pageSize || 20,
      columns: '*',
      orderBy: { column: 'sort_order', ascending: true },
      filters: (query) => {
        if (params?.isActive !== undefined) {
          return query.eq('is_active', params.isActive) as unknown as QueryBuilder;
        }
        return query;
      },
    });
  }

  async create(category: CategoryInsert): Promise<ActionResult<Category>> {
    return this.insert(category as unknown as Partial<Category>);
  }

  async updateCategory(id: string, category: CategoryUpdate): Promise<ActionResult<Category>> {
    return this.update(id, category as unknown as Partial<Category>);
  }
}
