import type { Database } from './database';

export type Banner = Database['public']['Tables']['banners']['Row'];
export type BannerInsert = Database['public']['Tables']['banners']['Insert'];
export type BannerUpdate = Database['public']['Tables']['banners']['Update'];
