import { createServerClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';
export async function ContentOverviewWidget() {
  const supabase = await createServerClient();
  const { count: totalPages } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true });
  const { count: publishedPages } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);
  return (
    <div className="bg-card rounded-lg border p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {' '}
      <div className="flex items-center justify-between">
        {' '}
        <h3 className="text-sm font-semibold">Pages Overview</h3>{' '}
        <FileText className="text-muted-foreground h-4 w-4" />{' '}
      </div>{' '}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {' '}
        <div>
          {' '}
          <p className="text-2xl font-bold">{totalPages ?? 0}</p>{' '}
          <p className="text-muted-foreground text-xs">Total Pages</p>{' '}
        </div>{' '}
        <div>
          {' '}
          <p className="text-2xl font-bold">{publishedPages ?? 0}</p>{' '}
          <p className="text-muted-foreground text-xs">Published</p>{' '}
        </div>{' '}
        <div>
          {' '}
          <p className="text-2xl font-bold">{(totalPages ?? 0) - (publishedPages ?? 0)}</p>{' '}
          <p className="text-muted-foreground text-xs">Drafts</p>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
