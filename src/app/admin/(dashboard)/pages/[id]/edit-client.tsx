'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { updatePage } from '@/actions/page-actions';
import { PageForm, type PageFormValues } from '../page-form';
import { PageBuilder } from '@/components/admin/page-builder';
import { Button } from '@/components/ui/button';
import type { PageContentBlock } from '@/types/page';

interface EditPageClientProps {
  page: {
    id: string;
    title: string;
    slug: string;
    content: PageContentBlock[];
    meta_title: string | null;
    meta_description: string | null;
    template: string;
    is_published: boolean;
    sort_order: number;
  };
}

export function EditPageClient({ page }: EditPageClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [blocks, setBlocks] = useState<PageContentBlock[]>(page.content || []);

  async function handleMetaSubmit(data: PageFormValues) {
    setPending(true);
    const result = await updatePage(page.id, {
      ...data,
      content: blocks as any,
    } as any);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Page metadata updated');
      router.refresh();
    }
  }

  async function handleSaveBlocks() {
    setPending(true);
    const result = await updatePage(page.id, {
      title: page.title,
      slug: page.slug,
      template: page.template as any,
      is_published: page.is_published,
      sort_order: page.sort_order,
      content: blocks as any,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
    } as any);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Page content saved');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Page: {page.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowMetaForm(!showMetaForm)}>
            {showMetaForm ? 'Hide Settings' : 'Page Settings'}
          </Button>
          <Button onClick={handleSaveBlocks} disabled={pending}>
            {pending ? 'Saving...' : 'Save Content'}
          </Button>
        </div>
      </div>

      {showMetaForm && (
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Page Settings</h2>
          <PageForm
            onSubmit={handleMetaSubmit}
            pending={pending}
            defaultValues={{
              title: page.title,
              slug: page.slug,
              meta_title: page.meta_title || '',
              meta_description: page.meta_description || '',
              template: page.template as any,
              is_published: page.is_published,
              sort_order: page.sort_order,
            }}
          />
        </div>
      )}

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Content Builder</h2>
        <PageBuilder blocks={blocks} onBlocksChange={setBlocks} />
      </div>
    </div>
  );
}
