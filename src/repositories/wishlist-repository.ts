import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult } from '@/types/common';
import { BaseRepository } from './base-repository';

type WishlistRow = Database['public']['Tables']['wishlist']['Row'];
type WishlistInsert = Database['public']['Tables']['wishlist']['Insert'];

export class WishlistRepository extends BaseRepository<WishlistRow> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'wishlist');
  }

  async findByUserId(userId: string): Promise<ActionResult<WishlistRow[]>> {
    const { data, error } = await this.supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) return { data: null, error: error.message };
    return { data: data as WishlistRow[], error: null };
  }

  async add(item: WishlistInsert): Promise<ActionResult<WishlistRow>> {
    return this.insert(item as unknown as Partial<WishlistRow>);
  }

  async remove(userId: string, productId: string): Promise<ActionResult<null>> {
    const { error } = await this.supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  }
}
