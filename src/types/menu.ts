import type { Database } from './database';

export type Menu = Database['public']['Tables']['menus']['Row'];
export type MenuInsert = Database['public']['Tables']['menus']['Insert'];
export type MenuUpdate = Database['public']['Tables']['menus']['Update'];

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  children: MenuItem[];
}
