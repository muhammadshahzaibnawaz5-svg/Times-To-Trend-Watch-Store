import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Section, SectionInsert, SectionUpdate } from '@/types/section';
import type { ActionResult } from '@/types/common';
import { BaseRepository } from './base-repository';

export class SectionRepository extends BaseRepository<Section> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'sections');
  }

  async findActive(): Promise<ActionResult<Section[]>> {
    const { data, error } = await this.supabase
      .from('sections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as Section[], error: null };
  }

  async create(section: SectionInsert): Promise<ActionResult<Section>> {
    return this.insert(section as unknown as Partial<Section>);
  }

  async updateSection(id: string, section: SectionUpdate): Promise<ActionResult<Section>> {
    return this.update(id, section as unknown as Partial<Section>);
  }
}
