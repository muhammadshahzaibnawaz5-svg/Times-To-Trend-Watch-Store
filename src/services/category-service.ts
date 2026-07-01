import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Category, CategoryInsert, CategoryUpdate } from '@/types/category';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { CategoryRepository, type AdminCategoryParams } from '@/repositories/category-repository';
import { StorageServiceAdmin } from '@/services/storage-service-admin';

export class CategoryService {
  private repository: CategoryRepository;
  private storage: StorageServiceAdmin;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new CategoryRepository(supabase);
    this.storage = new StorageServiceAdmin(supabase);
  }

  async getAllAdmin(params?: AdminCategoryParams): Promise<PaginatedResult<Category>> {
    return this.repository.findAllAdmin(params);
  }

  async getAll(options?: {
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<ActionResult<Category[]>> {
    return this.repository.findAll({
      orderBy: options?.orderBy || { column: 'sort_order', ascending: true },
    });
  }

  async getActive(): Promise<ActionResult<Category[]>> {
    return this.repository.findActive();
  }

  async getBySlug(slug: string): Promise<ActionResult<Category>> {
    return this.repository.findBySlug(slug);
  }

  async getById(id: string): Promise<ActionResult<Category>> {
    return this.repository.findById(id);
  }

  async create(category: CategoryInsert): Promise<ActionResult<Category>> {
    return this.repository.create(category);
  }

  async update(id: string, category: CategoryUpdate): Promise<ActionResult<Category>> {
    return this.repository.updateCategory(id, category);
  }

  async toggleActive(id: string): Promise<ActionResult<Category>> {
    const { data: current } = await this.repository.findById(id);
    if (!current) return { data: null, error: 'Category not found' };
    return this.repository.updateCategory(id, { is_active: !current.is_active } as CategoryUpdate);
  }

  async reorder(items: { id: string; sort_order: number }[]): Promise<ActionResult<null>> {
    for (const item of items) {
      const { error } = await this.repository.update(item.id, { sort_order: item.sort_order } as Partial<Category>);
      if (error) return { data: null, error };
    }
    return { data: null, error: null };
  }

  async delete(id: string): Promise<ActionResult<null>> {
    const { data: category } = await this.repository.findById(id);
    if (category?.image_url) {
      const path = category.image_url.split('/').pop();
      if (path) {
        await this.storage.deleteFile('categories', path);
      }
    }
    return this.repository.delete(id);
  }
}
