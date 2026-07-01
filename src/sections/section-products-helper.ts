import { createServerClient } from '@/lib/supabase/server';

/**
 * Fetches products for a section. If manual assignments exist in section_products,
 * returns those products sorted by sort_order. Otherwise falls back to the dynamic
 * query callback.
 */
export async function getSectionProducts(
  sectionId: string | undefined,
  dynamicQuery: (supabase: Awaited<ReturnType<typeof createServerClient>>) => Promise<any[] | null>,
): Promise<any[] | null> {
  const supabase = await createServerClient();

  let assignedProducts: any[] | null = null;
  let assignedIds: Set<string> | null = null;

  if (sectionId) {
    const { data: assignments } = await supabase
      .from('section_products')
      .select('product_id, sort_order')
      .eq('section_id', sectionId)
      .order('sort_order', { ascending: true });

    if (assignments && assignments.length > 0) {
      const productIds = assignments.map((a: { product_id: string }) => a.product_id);
      const { data: manualProducts } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('status', 'active')
        .in('id', productIds);

      if (manualProducts) {
        const productMap = new Map(manualProducts.map((p: { id: string }) => [p.id, p]));
        assignedProducts = assignments
          .map((a: { product_id: string }) => productMap.get(a.product_id))
          .filter(Boolean) as any[];
        assignedIds = new Set(productIds);
      }
    }
  }

  // Fallback + merge: always run dynamic query, then prepend any manual assignments
  const fallback = await dynamicQuery(supabase);
  if (assignedProducts && assignedIds) {
    const additional = (fallback || []).filter(
      (p: any) => !assignedIds!.has(p.id),
    );
    return [...assignedProducts, ...additional];
  }
  return fallback;
}
