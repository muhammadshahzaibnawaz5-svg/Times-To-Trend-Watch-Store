'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormInput, FormTextarea, FormSelect, FormSwitch } from '@/components/shared';
import { SlugInput } from '@/components/shared/slug-input';
import { ImageUpload } from '@/components/shared/image-upload';
import { getActiveCategories } from '@/actions/category-actions';
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative('Price must be non-negative'),
  discount_price: z.coerce.number().nonnegative().optional().nullable(),
  sku: z.string().min(1, 'SKU is required'),
  stock_quantity: z.coerce.number().int().nonnegative().default(0),
  category_id: z.string().min(1, 'Category is required'),
  status: z.string().default('draft'),
  is_featured: z.boolean().default(false),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  og_image: z.string().optional(),
  images: z.array(z.object({ url: z.string() })).default([]),
});
export type ProductFormValues = z.infer<typeof formSchema>;
interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => Promise<void>;
  pending: boolean;
  defaultValues?: Partial<ProductFormValues>;
}
export function ProductForm({ onSubmit, pending, defaultValues }: ProductFormProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      discount_price: null,
      sku: '',
      stock_quantity: 0,
      category_id: '',
      status: 'draft',
      is_featured: false,
      meta_title: '',
      meta_description: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      og_image: '',
      images: [],
      ...defaultValues,
    },
  });
  useEffect(() => {
    getActiveCategories().then((result) => {
      if (result.data) setCategories(result.data);
    });
  }, []);
  const imageUrls = form.watch('images')?.map((i) => i.url) ?? [];
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
      <div className="grid gap-4 md:grid-cols-3">
        {' '}
        <FormInput form={form} name="price" label="Price" type="number" required />{' '}
        <FormInput form={form} name="discount_price" label="Discount Price" type="number" />{' '}
        <FormInput form={form} name="sku" label="SKU" required />{' '}
      </div>{' '}
      <div className="grid gap-4 md:grid-cols-3">
        {' '}
        <FormInput form={form} name="stock_quantity" label="Stock Quantity" type="number" />{' '}
        <FormSelect
          form={form}
          name="category_id"
          label="Category"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          required
        />{' '}
        <FormSelect
          form={form}
          name="status"
          label="Status"
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
          ]}
        />{' '}
      </div>{' '}
      <FormSwitch form={form} name="is_featured" label="Featured Product" />{' '}
      <div className="space-y-2">
        {' '}
        <p className="text-sm font-medium">Images</p>{' '}
        <ImageUpload
          bucket="products"
          endpoint="/api/upload/imgbb"
          existingUrls={imageUrls}
          onImagesChange={(urls) =>
            form.setValue(
              'images',
              urls.map((url) => ({ url })),
            )
          }
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
          <FormInput form={form} name="meta_title" label="Meta Title" />{' '}
          <FormInput form={form} name="meta_description" label="Meta Description" />{' '}
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
          {pending ? 'Saving...' : 'Save Product'}{' '}
        </Button>{' '}
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {' '}
          Cancel{' '}
        </Button>{' '}
      </div>{' '}
    </form>
  );
}
