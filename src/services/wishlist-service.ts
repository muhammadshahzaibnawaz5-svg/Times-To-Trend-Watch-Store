import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult } from '@/types/common';
import { WishlistRepository } from '@/repositories/wishlist-repository';

type WishlistRow = Database['public']['Tables']['wishlist']['Row'];

export class WishlistService {
  private repository: WishlistRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new WishlistRepository(supabase);
  }

  async getByUser(userId: string): Promise<ActionResult<WishlistRow[]>> {
    return this.repository.findByUserId(userId);
  }

  async add(userId: string, productId: string): Promise<ActionResult<WishlistRow>> {
    return this.repository.add({ user_id: userId, product_id: productId });
  }

  async remove(userId: string, productId: string): Promise<ActionResult<null>> {
    return this.repository.remove(userId, productId);
  }
}
