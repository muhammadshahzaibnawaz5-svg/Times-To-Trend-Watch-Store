import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(request.url);

  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('status', 'active');

  const category = searchParams.get('category');
  if (category) query = query.eq('categories.slug', category);

  const search = searchParams.get('search');
  if (search) query = query.ilike('name', `%${search}%`);

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  return NextResponse.json({ data, count, page, pageSize });
}
