import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Product, ProductInsert, ProductUpdate } from '@/types/product';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { BaseRepository } from './base-repository';

type QueryBuilder = ReturnType<SupabaseClient<Database>['from']>;

export interface AdminProductParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  isFeatured?: boolean;
}

export class ProductRepository extends BaseRepository<Product> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'products');
  }

  async findBySlug(slug: string): Promise<ActionResult<Product>> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as unknown as Product, error: null };
  }

  async findActive(options: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    isFeatured?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PaginatedResult<Product>> {
    const sortColumn = options.sortBy || 'created_at';
    const sortAscending = options.sortOrder ? options.sortOrder === 'asc' : false;

    return this.findAllPaginated({
      page: options.page,
      pageSize: options.pageSize || 12,
      columns: '*, categories(name, slug)',
      orderBy: { column: sortColumn, ascending: sortAscending },
      filters: (query) => {
        let q = (query as any).eq('status', 'active');
        if (options.categoryId) q = q.eq('category_id', options.categoryId);
        if (options.isFeatured !== undefined) q = q.eq('is_featured', options.isFeatured);
        if (options.search) q = q.ilike('name', `%${options.search}%`);
        if (options.minPrice !== undefined) q = q.gte('price', options.minPrice);
        if (options.maxPrice !== undefined) q = q.lte('price', options.maxPrice);
        return q as QueryBuilder;
      },
    });
  }

  async findRelated(
    productId: string,
    categoryId: string,
    limit: number = 4,
  ): Promise<ActionResult<Product[]>> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('status', 'active')
      .eq('category_id', categoryId)
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as unknown as Product[], error: null };
  }

  async findAllAdmin(params?: AdminProductParams): Promise<PaginatedResult<Product>> {
    return this.findAllPaginated({
      page: params?.page,
      pageSize: params?.pageSize || 20,
      columns: '*, categories(name)',
      orderBy: { column: 'created_at', ascending: false },
      filters: (query) => {
        let q = query as any;
        if (params?.search) q = q.ilike('name', `%${params.search}%`);
        if (params?.status) q = q.eq('status', params.status);
        if (params?.categoryId) q = q.eq('category_id', params.categoryId);
        if (params?.isFeatured !== undefined) q = q.eq('is_featured', params.isFeatured);
        return q as QueryBuilder;
      },
    });
  }

  async create(product: ProductInsert): Promise<ActionResult<Product>> {
    return this.insert(product as unknown as Partial<Product>);
  }

  async updateProduct(id: string, product: ProductUpdate): Promise<ActionResult<Product>> {
    return this.update(id, product as unknown as Partial<Product>);
  }
}
