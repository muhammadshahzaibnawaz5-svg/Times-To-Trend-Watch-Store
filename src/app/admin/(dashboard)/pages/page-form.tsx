'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormInput, FormTextarea, FormSwitch, FormSelect } from '@/components/shared';
import { SlugInput } from '@/components/shared/slug-input';
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  template: z.enum(['default', 'full_width', 'sidebar', 'landing']).default('default'),
  is_published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});
export type PageFormValues = z.infer<typeof formSchema>;
interface PageFormProps {
  onSubmit: (data: PageFormValues) => Promise<void>;
  pending: boolean;
  defaultValues?: Partial<PageFormValues>;
}
export function PageForm({ onSubmit, pending, defaultValues }: PageFormProps) {
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      meta_title: '',
      meta_description: '',
      template: 'default',
      is_published: false,
      sort_order: 0,
      ...defaultValues,
    },
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormInput form={form} name="title" label="Title" required />{' '}
        <div className="space-y-2">
          {' '}
          <p className="text-sm font-medium">
            {' '}
            Slug <span className="text-destructive ml-1">*</span>{' '}
          </p>{' '}
          <SlugInput form={form} nameField="title" slugField="slug" />{' '}
          {form.formState.errors.slug && (
            <p className="text-destructive text-sm">{form.formState.errors.slug.message}</p>
          )}{' '}
        </div>{' '}
      </div>{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormInput form={form} name="meta_title" label="Meta Title" />{' '}
        <FormSelect
          form={form}
          name="template"
          label="Template"
          options={[
            { value: 'default', label: 'Default' },
            { value: 'full_width', label: 'Full Width' },
            { value: 'sidebar', label: 'Sidebar' },
            { value: 'landing', label: 'Landing' },
          ]}
        />{' '}
      </div>{' '}
      <FormTextarea form={form} name="meta_description" label="Meta Description" />{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormSwitch form={form} name="is_published" label="Published" />{' '}
        <FormInput form={form} name="sort_order" label="Sort Order" type="number" />{' '}
      </div>{' '}
      <div className="flex gap-2">
        {' '}
        <Button type="submit" disabled={pending}>
          {' '}
          {pending ? 'Saving...' : 'Save Page'}{' '}
        </Button>{' '}
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {' '}
          Cancel{' '}
        </Button>{' '}
      </div>{' '}
    </form>
  );
}
