import { createServerClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';

export async function ContentOverviewWidget() {
  const supabase = await createServerClient();

  let totalPages: number | null = null;
  let publishedPages: number | null = null;

  try {
    const result = await supabase
      .from('pages')
      .select('*', { count: 'exact', head: true });
    totalPages = result.count ?? 0;
    console.log('[ContentOverviewWidget] total pages:', totalPages);
  } catch (err) {
    console.error('[ContentOverviewWidget] pages count query failed:', err);
    totalPages = 0;
  }

  try {
    const result = await supabase
      .from('pages')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);
    publishedPages = result.count ?? 0;
    console.log('[ContentOverviewWidget] published pages:', publishedPages);
  } catch (err) {
    console.error('[ContentOverviewWidget] published pages query failed:', err);
    publishedPages = 0;
  }

  const safeTotal = totalPages ?? 0;
  const safePublished = publishedPages ?? 0;

  return (
    <div className="bg-card rounded-lg border p-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Pages Overview</h3>
        <FileText className="text-muted-foreground h-4 w-4" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold">{safeTotal}</p>
          <p className="text-muted-foreground text-xs">Total Pages</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{safePublished}</p>
          <p className="text-muted-foreground text-xs">Published</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{safeTotal - safePublished}</p>
          <p className="text-muted-foreground text-xs">Drafts</p>
        </div>
      </div>
    </div>
  );
}
