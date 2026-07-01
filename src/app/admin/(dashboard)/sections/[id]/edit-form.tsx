'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateSection } from '@/actions/section-actions';
import { SectionForm } from '../section-form';
import type { ActionResult } from '@/types/common';
import type { Section } from '@/types/section';

interface EditSectionFormProps {
  section: Record<string, unknown>;
}

export function EditSectionForm({ section }: EditSectionFormProps) {
  const router = useRouter();
  const boundUpdate = updateSection.bind(null, section.id as string);
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult<Section>, formData: FormData) => await boundUpdate(formData),
    { data: null, error: null },
  );

  useEffect(() => {
    if (state.data) {
      toast.success('Section updated successfully');
      router.push('/admin/sections');
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <SectionForm
      formAction={formAction}
      pending={pending}
      isEdit
      defaultValues={{
        name: section.name as string,
        type: section.type as any,
        title: (section.title as string) || '',
        subtitle: (section.subtitle as string) || '',
        isActive: section.is_active as boolean,
        sortOrder: section.sort_order as number,
        settings: (section.settings as Record<string, unknown>) || {},
      }}
    />
  );
}
