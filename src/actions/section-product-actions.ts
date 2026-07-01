'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import type { ActionResult } from '@/types/common';

export interface SectionAssignment {
  sectionId: string;
  sectionName: string;
  sectionType: string;
  position: 'first' | 'last' | number;
}

export async function getProductSections() {
  await requireAdmin();
  const supabase = createAdminClient();

  const productSectionTypes = [
    'featured_products',
    'new_arrivals',
    'best_sellers',
    'trending',
    'discount_products',
  ];

  const { data: sections } = await supabase
    .from('sections')
    .select('id, name, type, settings')
    .in('type', productSectionTypes)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { data: sections || [], error: null };
}

export async function assignProductToSections(
  productId: string,
  assignments: { sectionId: string; position: 'first' | 'last' }[],
): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();

  for (const assignment of assignments) {
    // Determine sort_order: first = 0, last = max+1
    let sortOrder = 0;

    if (assignment.position === 'last') {
      const { data: existing } = await supabase
        .from('section_products')
        .select('sort_order')
        .eq('section_id', assignment.sectionId)
        .order('sort_order', { ascending: false })
        .limit(1);

      sortOrder = (existing?.[0]?.sort_order ?? -1) + 1;
    }

    // Upsert: if already assigned, update position
    const { error } = await supabase.from('section_products').upsert(
      {
        section_id: assignment.sectionId,
        product_id: productId,
        sort_order: sortOrder,
      },
      {
        onConflict: 'section_id, product_id',
        ignoreDuplicates: false,
      },
    );

    if (error) return { data: null, error: error.message };

    // If position is 'first', shift all other products up
    if (assignment.position === 'first') {
      const { data: existingProducts } = await supabase
        .from('section_products')
        .select('id, sort_order')
        .eq('section_id', assignment.sectionId)
        .neq('product_id', productId)
        .order('sort_order', { ascending: true });

      if (existingProducts) {
        for (let i = 0; i < existingProducts.length; i++) {
          const { error: updateError } = await supabase
            .from('section_products')
            .update({ sort_order: i + 1 })
            .eq('id', existingProducts[i].id);
          if (updateError) return { data: null, error: updateError.message };
        }
      }
    }
  }

  // Revalidate all relevant paths
  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath('/admin/sections');

  return { data: null, error: null };
}

export async function getProductSectionAssignments(
  productId: string,
): Promise<ActionResult<{ sectionId: string; position: 'first' | 'last' | number }[]>> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('section_products')
    .select('section_id, sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) return { data: null, error: error.message };

  return {
    data: (data || []).map((sp: { section_id: string; sort_order: number }) => ({
      sectionId: sp.section_id,
      position: sp.sort_order === 0 ? 'first' as const : sp.sort_order as number,
    })),
    error: null,
  };
}

export async function removeProductFromSection(
  productId: string,
  sectionId: string,
): Promise<ActionResult<null>> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('section_products')
    .delete()
    .eq('section_id', sectionId)
    .eq('product_id', productId);

  if (error) return { data: null, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { data: null, error: null };
}
