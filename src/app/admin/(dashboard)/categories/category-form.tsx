'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormInput, FormTextarea, FormSwitch } from '@/components/shared';
import { SlugInput } from '@/components/shared/slug-input';
import { ImageUpload } from '@/components/shared/image-upload';
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
  image_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  og_image: z.string().optional(),
});
export type CategoryFormValues = z.infer<typeof formSchema>;
interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  pending: boolean;
  defaultValues?: Partial<CategoryFormValues>;
}
export function CategoryForm({ onSubmit, pending, defaultValues }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      is_active: true,
      sort_order: 0,
      image_url: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      og_image: '',
      ...defaultValues,
    },
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormInput form={form} name="name" label="Name" required />{' '}
        <div className="space-y-2">
          {' '}
          <p className="text-sm font-medium">
            {' '}
            Slug <span className="text-destructive ml-1">*</span>{' '}
          </p>{' '}
          <SlugInput form={form} nameField="name" slugField="slug" />{' '}
          {form.formState.errors.slug && (
            <p className="text-destructive text-sm">{form.formState.errors.slug.message}</p>
          )}{' '}
        </div>{' '}
      </div>{' '}
      <FormTextarea form={form} name="description" label="Description" />{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormSwitch form={form} name="is_active" label="Active" />{' '}
        <FormInput form={form} name="sort_order" label="Sort Order" type="number" />{' '}
      </div>{' '}
      <div className="space-y-2">
        {' '}
        <p className="text-sm font-medium">Image</p>{' '}
        <ImageUpload
          bucket="categories"
          existingUrls={form.watch('image_url') ? [form.watch('image_url')!] : []}
          onImagesChange={(urls) => form.setValue('image_url', urls[0] ?? '')}
          maxFiles={1}
        />{' '}
      </div>{' '}
      <details className="border-border rounded-lg border p-4">
        {' '}
        <summary className="text-foreground cursor-pointer text-sm font-semibold uppercase">
          {' '}
          SEO Settings{' '}
        </summary>{' '}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {' '}
          <FormInput form={form} name="seo_title" label="SEO Title" />{' '}
          <FormInput form={form} name="seo_description" label="SEO Description" />{' '}
          <FormInput form={form} name="seo_keywords" label="SEO Keywords" />{' '}
          <FormInput form={form} name="og_image" label="OG Image URL" />{' '}
        </div>{' '}
      </details>{' '}
      <div className="flex gap-2">
        {' '}
        <Button type="submit" disabled={pending}>
          {' '}
          {pending ? 'Saving...' : 'Save Category'}{' '}
        </Button>{' '}
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {' '}
          Cancel{' '}
        </Button>{' '}
      </div>{' '}
    </form>
  );
}
