'use server';

import { createServiceAction } from '@/lib/create-service-action';
import { BannerService } from '@/services/banner-service';
import { MenuService } from '@/services/menu-service';
import { ProductService } from '@/services/product-service';
import { SettingsService } from '@/services/settings-service';

export async function getStoreBanners() {
  return createServiceAction(BannerService, 'getActive');
}

export async function getStoreMenu(location: string) {
  return createServiceAction(MenuService, 'getByLocation', location);
}

export async function getStoreMenus() {
  return createServiceAction(MenuService, 'getAll');
}

export async function getStoreProducts(options?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return createServiceAction(ProductService, 'getActive', options);
}

export async function getStoreSettings() {
  return createServiceAction(SettingsService, 'getAll');
}

export async function getStoreProductBySlug(slug: string) {
  return createServiceAction(ProductService, 'getBySlug', slug);
}
