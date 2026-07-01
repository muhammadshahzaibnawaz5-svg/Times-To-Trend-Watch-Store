'use client';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createSection } from '@/actions/section-actions';
import { SectionForm } from '../section-form';
import type { ActionResult } from '@/types/common';
import type { Section } from '@/types/section';
export default function NewSectionPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<Section>, formData: FormData) => await createSection(formData),
    { data: null, error: null },
  );
  useEffect(() => {
    if (state.data) {
      toast.success('Section created successfully');
      router.push('/admin/sections');
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {' '}
      <h1 className="text-3xl font-bold">New Section</h1>{' '}
      <SectionForm formAction={formAction} pending={pending} />{' '}
    </div>
  );
}
