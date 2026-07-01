'use client';

import { updateProduct } from '@/actions/product-actions';
import { useAdminForm } from '@/hooks/use-admin-form';
import { ProductForm, type ProductFormValues } from '../product-form';
import type { Product } from '@/types/product';

interface EditProductFormProps {
  product: Product;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const { pending, handleSubmit } = useAdminForm<ProductFormValues, Product>({
    submitAction: (data) => updateProduct(product.id, data),
    successMessage: 'Product updated successfully',
    redirectTo: '/admin/products',
  });

  return (
    <ProductForm
      onSubmit={handleSubmit}
      pending={pending}
      defaultValues={{
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        price: product.price,
        discount_price: (product as any).discount_price ?? null,
        sku: product.sku,
        stock_quantity: (product as any).stock_quantity ?? 0,
        category_id: (product as any).category_id ?? '',
        status: product.status ?? 'draft',
        is_featured: (product as any).is_featured ?? false,
        meta_title: (product as any).meta_title ?? '',
        meta_description: (product as any).meta_description ?? '',
        images: ((product as any).images ?? []) as { url: string }[],
      }}
    />
  );
}
