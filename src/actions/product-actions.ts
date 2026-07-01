'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { ProductService } from '@/services/product-service';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult, PaginatedResult } from '@/types/common';
import type { Product } from '@/types/product';
import type { AdminProductParams } from '@/repositories/product-repository';
import type { ProductFormValues } from '@/app/admin/(dashboard)/products/product-form';

export async function getProductsAdmin(params?: AdminProductParams): Promise<PaginatedResult<Product>> {
  await requireAdmin();
  const supabase = createAdminClient();
  const service = new ProductService(supabase);
  return service.getAllAdmin(params);
}

export async function createProduct(data: ProductFormValues): Promise<ActionResult<Product>> {
  console.log('[createProduct] called with data:', JSON.stringify({ ...data, images: '...' }));
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new ProductService(supabase);

    const result = await service.create({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: data.price,
      discount_price: data.discount_price || null,
      sku: data.sku,
      stock_quantity: data.stock_quantity,
      category_id: data.category_id,
      status: data.status as 'draft' | 'active' | 'archived',
      is_featured: data.is_featured,
      images: data.images as any,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      seo_keywords: data.seo_keywords || null,
      og_image: data.og_image || null,
    } as any);

    console.log('[createProduct] result:', JSON.stringify({ error: result.error, data: result.data ? 'present' : 'null' }));
    if (!result.error) {
      revalidatePath('/admin/products');
      revalidatePath('/');
      revalidatePath('/products');
    }
    return result;
  } catch (err) {
    const msg = `[createProduct] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}

export async function updateProduct(id: string, data: ProductFormValues): Promise<ActionResult<Product>> {
  console.log('[updateProduct] called id=', id);
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new ProductService(supabase);

    const result = await service.update(id, {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: data.price,
      discount_price: data.discount_price || null,
      sku: data.sku,
      stock_quantity: data.stock_quantity,
      category_id: data.category_id,
      status: data.status as 'draft' | 'active' | 'archived',
      is_featured: data.is_featured,
      images: data.images as any,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      seo_keywords: data.seo_keywords || null,
      og_image: data.og_image || null,
    } as any);

    if (!result.error) {
      revalidatePath('/admin/products');
      revalidatePath('/');
      revalidatePath('/products');
    }
    return result;
  } catch (err) {
    const msg = `[updateProduct] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}

export async function toggleProductStatus(id: string): Promise<ActionResult<Product>> {
  console.log('[toggleProductStatus] called id=', id);
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new ProductService(supabase);
    const result = await service.toggleStatus(id);
    if (!result.error) {
      revalidatePath('/admin/products');
      revalidatePath('/');
      revalidatePath('/products');
    }
    return result;
  } catch (err) {
    const msg = `[toggleProductStatus] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult<null>> {
  console.log('[deleteProduct] called id=', id);
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const service = new ProductService(supabase);
    const result = await service.delete(id);
    if (!result.error) {
      revalidatePath('/admin/products');
      revalidatePath('/');
      revalidatePath('/products');
    }
    return result;
  } catch (err) {
    const msg = `[deleteProduct] UNEXPECTED ERROR: ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    return { data: null, error: msg };
  }
}

export async function getProducts(options?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}) {
  return createServiceAction(ProductService, 'getActive', options);
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return createServiceAction(ProductService, 'getRelated', productId, categoryId);
}

export async function getAllProducts() {
  return createServiceAction(ProductService, 'getAll');
}

export async function getProductBySlug(slug: string) {
  return createServiceAction(ProductService, 'getBySlug', slug);
}
