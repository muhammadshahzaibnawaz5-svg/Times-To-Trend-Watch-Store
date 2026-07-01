'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ActionResult } from '@/types/common';

type UseAdminFormOptions<TValues, TResult> = {
  submitAction: (values: TValues) => Promise<ActionResult<TResult>>;
  successMessage: string;
  redirectTo: string;
};

export function useAdminForm<TValues, TResult>({
  submitAction,
  successMessage,
  redirectTo,
}: UseAdminFormOptions<TValues, TResult>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(values: TValues) {
    setPending(true);
    const result = await submitAction(values);
    setPending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(successMessage);
    router.push(redirectTo);
  }

  return { pending, handleSubmit };
}
