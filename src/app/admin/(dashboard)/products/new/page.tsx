'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProduct } from '@/actions/product-actions';
import { assignProductToSections } from '@/actions/section-product-actions';
import { ProductForm, type ProductFormValues } from '../product-form';
import { SectionAssignmentStep } from '@/components/admin/section-assignment-step';
import { useState } from 'react';
export default function NewProductPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignments, setAssignments] = useState<
    { sectionId: string; position: 'first' | 'last' }[]
  >([]);
  async function handleSubmit(data: ProductFormValues) {
    setPending(true);
    try {
      const result = await createProduct(data);
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        toast.success('Product created successfully');
        setCreatedProductId(result.data.id);
        setShowAssignment(true);
      }
    } catch {
      toast.error('Failed to create product. Please try again.');
    } finally {
      setPending(false);
    }
  }
  async function handleAssignmentsComplete() {
    if (!createdProductId) {
      router.push('/admin/products');
      return;
    }
    if (assignments.length === 0) {
      router.push('/admin/products');
      return;
    }
    setPending(true);
    try {
      const result = await assignProductToSections(createdProductId, assignments);
      if (result.error) {
        toast.error(`Product created but section assignment failed: ${result.error}`);
      } else {
        toast.success('Product assigned to sections');
      }
    } catch {
      toast.error('Product created but section assignment encountered an error.');
    } finally {
      setPending(false);
    }
    router.push('/admin/products');
  }
  function handleSkip() {
    router.push('/admin/products');
  }
  if (showAssignment && createdProductId) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {' '}
        <h1 className="text-3xl font-bold">Assign to Sections</h1>{' '}
        <p className="text-muted-foreground text-sm">
          {' '}
          Your product was created. Optionally assign it to sections below.{' '}
        </p>{' '}
        <SectionAssignmentStep
          onAssignmentsChange={setAssignments}
          onComplete={handleAssignmentsComplete}
          onSkip={handleSkip}
          loading={pending}
        />{' '}
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {' '}
      <h1 className="text-3xl font-bold">New Product</h1>{' '}
      <ProductForm onSubmit={handleSubmit} pending={pending} />{' '}
    </div>
  );
}
