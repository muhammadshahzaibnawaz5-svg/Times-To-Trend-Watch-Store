import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Section, SectionInsert, SectionUpdate } from '@/types/section';
import type { ActionResult } from '@/types/common';
import { SectionRepository } from '@/repositories/section-repository';

export class SectionService {
  private repository: SectionRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new SectionRepository(supabase);
  }

  async getAll(options?: {
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<ActionResult<Section[]>> {
    return this.repository.findAll({
      orderBy: options?.orderBy || { column: 'sort_order', ascending: true },
    });
  }

  async getById(id: string): Promise<ActionResult<Section>> {
    return this.repository.findById(id);
  }

  async getActive(): Promise<ActionResult<Section[]>> {
    return this.repository.findActive();
  }

  async create(section: SectionInsert): Promise<ActionResult<Section>> {
    return this.repository.create(section);
  }

  async update(id: string, section: SectionUpdate): Promise<ActionResult<Section>> {
    return this.repository.updateSection(id, section);
  }

  async toggleActive(id: string): Promise<ActionResult<Section>> {
    const { data: current } = await this.repository.findById(id);
    if (!current) return { data: null, error: 'Section not found' };
    return this.repository.updateSection(id, { is_active: !current.is_active } as SectionUpdate);
  }

  async delete(id: string): Promise<ActionResult<null>> {
    return this.repository.delete(id) as Promise<ActionResult<null>>;
  }

  async reorder(items: { id: string; sort_order: number }[]): Promise<ActionResult<null>> {
    for (const item of items) {
      const { error } = await this.repository.update(item.id, { sort_order: item.sort_order } as any);
      if (error) return { data: null, error };
    }
    return { data: null, error: null };
  }
}
