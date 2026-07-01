import type { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://timestotrend.com';
  const supabase = await createServerClient();

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'active'),
    supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/featured-watches`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/cart`, lastModified: now, changeFrequency: 'never', priority: 0.3 },
    { url: `${baseUrl}/checkout`, lastModified: now, changeFrequency: 'never', priority: 0.2 },
    { url: `${baseUrl}/wishlist`, lastModified: now, changeFrequency: 'never', priority: 0.3 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'daily', priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (productsResult.data || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categoriesResult.data || []).map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updated_at ? new Date(category.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
