'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { createServiceAction } from '@/lib/create-service-action';
import { reviewSchema } from '@/schemas/review-schema';
import { ReviewService } from '@/services/review-service';
import { isDevMode, DEV_ADMIN, DEV_MODE_KEY } from '@/lib/dev-auth';
import type { ActionResult } from '@/types/common';

async function getDevUser() {
  if (!isDevMode()) return null;
  const cookieStore = await cookies();
  const devSession = cookieStore.get(DEV_MODE_KEY);
  if (devSession?.value === DEV_ADMIN.id) {
    return { id: DEV_ADMIN.id };
  }
  return null;
}

export async function createReview(formData: FormData): Promise<ActionResult<null>> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const devUser = await getDevUser();
  const effectiveUser = user || devUser;

  if (!effectiveUser) return { data: null, error: 'Not authenticated' };

  const parsed = reviewSchema.safeParse({
    productId: formData.get('productId'),
    rating: Number(formData.get('rating')),
    comment: formData.get('comment'),
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message };
  }

  const service = new ReviewService(supabase);
  const result = await service.create({
    product_id: parsed.data.productId,
    user_id: effectiveUser.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
  });

  if (result.error) return { data: null, error: result.error };
  return { data: null, error: null };
}

export async function getProductReviews(productId: string) {
  return createServiceAction(ReviewService, 'getByProduct', productId);
}
