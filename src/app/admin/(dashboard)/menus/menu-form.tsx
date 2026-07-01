'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/shared';
import { FormSelect } from '@/components/shared/forms/form-select';
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.enum(['header', 'footer', 'footer-bottom']),
});
export type MenuFormValues = z.infer<typeof formSchema>;
interface MenuFormProps {
  onSubmit: (data: MenuFormValues) => Promise<void>;
  pending: boolean;
  defaultValues?: Partial<MenuFormValues>;
}
export function MenuForm({ onSubmit, pending, defaultValues }: MenuFormProps) {
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', location: 'header', ...defaultValues },
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormInput form={form} name="name" label="Menu Name" required />{' '}
        <FormSelect
          form={form}
          name="location"
          label="Location"
          options={[
            { value: 'header', label: 'Header' },
            { value: 'footer', label: 'Footer' },
            { value: 'footer-bottom', label: 'Footer Bottom' },
          ]}
        />{' '}
      </div>{' '}
      <div className="flex gap-2">
        {' '}
        <Button type="submit" disabled={pending}>
          {' '}
          {pending ? 'Saving...' : 'Create Menu'}{' '}
        </Button>{' '}
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {' '}
          Cancel{' '}
        </Button>{' '}
      </div>{' '}
    </form>
  );
}
