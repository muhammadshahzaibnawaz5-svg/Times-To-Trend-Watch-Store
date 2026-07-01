import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { PageService } from '@/services/page-service';
import { PageRenderer } from '@/components/storefront/page-renderer';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();
  const service = new PageService(supabase);
  const { data: page } = await service.getBySlug(slug);

  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerClient();
  const service = new PageService(supabase);
  const { data: page } = await service.getBySlug(slug);

  if (!page || !page.is_published) notFound();

  const content = (page.content || []) as any[];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: page.title, href: `/pages/${slug}` },
          ]}
        />
      </div>
      <PageRenderer blocks={content} />
    </div>
  );
}
