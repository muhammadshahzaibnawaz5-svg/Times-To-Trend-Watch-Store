import type { Database } from './database';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ProductVariant = {
  id: string;
  label: string;
  value: string;
  price?: number;
  stock?: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt?: string;
};
