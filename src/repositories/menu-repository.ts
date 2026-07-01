import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Menu, MenuInsert, MenuUpdate } from '@/types/menu';
import type { ActionResult } from '@/types/common';
import { BaseRepository } from './base-repository';

export class MenuRepository extends BaseRepository<Menu> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'menus');
  }

  async findByLocation(location: string): Promise<ActionResult<Menu>> {
    const { data, error } = await this.supabase
      .from('menus')
      .select('*')
      .eq('location', location)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as unknown as Menu, error: null };
  }

  async createMenu(menu: MenuInsert): Promise<ActionResult<Menu>> {
    return this.insert(menu as unknown as Partial<Menu>);
  }

  async updateMenu(id: string, menu: MenuUpdate): Promise<ActionResult<Menu>> {
    return this.update(id, menu as unknown as Partial<Menu>);
  }
}
