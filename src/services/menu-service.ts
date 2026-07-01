import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Menu, MenuInsert, MenuUpdate } from '@/types/menu';
import type { ActionResult } from '@/types/common';
import { MenuRepository } from '@/repositories/menu-repository';

export class MenuService {
  private repository: MenuRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new MenuRepository(supabase);
  }

  async getAll(): Promise<ActionResult<Menu[]>> {
    return this.repository.findAll();
  }

  async getByLocation(location: string): Promise<ActionResult<Menu>> {
    return this.repository.findByLocation(location);
  }

  async getById(id: string): Promise<ActionResult<Menu>> {
    return this.repository.findById(id);
  }

  async create(menu: MenuInsert): Promise<ActionResult<Menu>> {
    return this.repository.createMenu(menu);
  }

  async update(id: string, menu: MenuUpdate): Promise<ActionResult<Menu>> {
    return this.repository.updateMenu(id, menu);
  }

  async delete(id: string): Promise<ActionResult<null>> {
    return this.repository.delete(id);
  }
}
