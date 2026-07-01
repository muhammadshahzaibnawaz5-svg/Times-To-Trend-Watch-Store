import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { ProductService } from '@/services/product-service';
import { EditProductForm } from './edit-form';
import { ProductSectionManager } from './product-section-manager';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createServerClient();
  const service = new ProductService(supabase);
  const { data: product } = await service.getById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1 text-sm">{product.name}</p>
      </div>
      <EditProductForm product={product} />
      <ProductSectionManager productId={id} />
    </div>
  );
}
