import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult } from '@/types/common';
import { ReviewRepository } from '@/repositories/review-repository';

type ReviewRow = Database['public']['Tables']['product_reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['product_reviews']['Insert'];

export class ReviewService {
  private repository: ReviewRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new ReviewRepository(supabase);
  }

  async getByProduct(productId: string): Promise<ActionResult<ReviewRow[]>> {
    return this.repository.findByProductId(productId);
  }

  async create(review: ReviewInsert): Promise<ActionResult<ReviewRow>> {
    return this.repository.create(review);
  }
}
