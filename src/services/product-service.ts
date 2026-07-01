import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Product, ProductInsert, ProductUpdate } from '@/types/product';
import type { ActionResult, PaginatedResult } from '@/types/common';
import { ProductRepository, type AdminProductParams } from '@/repositories/product-repository';
import { StorageServiceAdmin } from '@/services/storage-service-admin';

export class ProductService {
  private repository: ProductRepository;
  private storage: StorageServiceAdmin;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new ProductRepository(supabase);
    this.storage = new StorageServiceAdmin(supabase);
  }

  async getBySlug(slug: string): Promise<ActionResult<Product>> {
    return this.repository.findBySlug(slug);
  }

  async getActive(options?: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    isFeatured?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResult<Product>> {
    return this.repository.findActive(options);
  }

  async getRelated(productId: string, categoryId: string): Promise<ActionResult<Product[]>> {
    return this.repository.findRelated(productId, categoryId);
  }

  async getAllAdmin(params?: AdminProductParams): Promise<PaginatedResult<Product>> {
    return this.repository.findAllAdmin(params);
  }

  async getAll(options?: {
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<ActionResult<Product[]>> {
    return this.repository.findAll({
      columns: '*, categories(name)',
      orderBy: options?.orderBy || { column: 'created_at', ascending: false },
    });
  }

  async getById(id: string): Promise<ActionResult<Product>> {
    return this.repository.findById(id);
  }

  async create(product: ProductInsert): Promise<ActionResult<Product>> {
    if (product.discount_price && product.discount_price >= product.price) {
      return { data: null, error: 'Discount price must be less than regular price' };
    }
    return this.repository.create(product);
  }

  async update(id: string, product: ProductUpdate): Promise<ActionResult<Product>> {
    return this.repository.updateProduct(id, product);
  }

  async toggleStatus(id: string): Promise<ActionResult<Product>> {
    const { data: current } = await this.repository.findById(id);
    if (!current) return { data: null, error: 'Product not found' };
    const newStatus = current.status === 'active' ? 'draft' : 'active';
    return this.repository.updateProduct(id, { status: newStatus } as ProductUpdate);
  }

  async archive(id: string): Promise<ActionResult<Product>> {
    return this.repository.updateProduct(id, { status: 'archived' } as ProductUpdate);
  }

  async delete(id: string): Promise<ActionResult<null>> {
    try {
      const { data: product } = await this.repository.findById(id);
      if (product) {
        const images = (product as unknown as Record<string, unknown>).images as
          | Array<{ url: string }>
          | undefined;
        if (images?.length) {
          for (const img of images) {
            if (img.url?.includes('supabase.co')) {
              const path = img.url.split('/').pop();
              if (path) {
                await this.storage.deleteFile('products', path);
              }
            }
          }
        }
      }
    } catch {
      // Ignore image cleanup errors so FK errors surface to the caller
    }
    return this.repository.delete(id);
  }
}
