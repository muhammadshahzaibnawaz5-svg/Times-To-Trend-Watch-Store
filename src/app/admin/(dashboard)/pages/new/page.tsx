'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createPage } from '@/actions/page-actions';
import { PageForm, type PageFormValues } from '../page-form';
export default function NewPagePage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handleSubmit(data: PageFormValues) {
    setPending(true);
    const result = await createPage(data as any);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Page created successfully');
      router.push(`/admin/pages/${result.data!.id}`);
    }
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {' '}
      <h1 className="text-3xl font-bold">New Page</h1>{' '}
      <PageForm onSubmit={handleSubmit} pending={pending} />{' '}
    </div>
  );
}
