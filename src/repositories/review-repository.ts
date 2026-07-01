import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult } from '@/types/common';
import { BaseRepository } from './base-repository';

type ReviewRow = Database['public']['Tables']['product_reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['product_reviews']['Insert'];

export class ReviewRepository extends BaseRepository<ReviewRow> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'product_reviews');
  }

  async findByProductId(productId: string): Promise<ActionResult<ReviewRow[]>> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data as ReviewRow[], error: null };
  }

  async create(review: ReviewInsert): Promise<ActionResult<ReviewRow>> {
    return this.insert(review as unknown as Partial<ReviewRow>);
  }
}
