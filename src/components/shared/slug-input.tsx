'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useWatch, type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/utils';
interface SlugInputProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  nameField: FieldPath<TFormValues>;
  slugField: FieldPath<TFormValues>;
  disabled?: boolean;
}
export function SlugInput<TFormValues extends FieldValues>({
  form,
  nameField,
  slugField,
  disabled,
}: SlugInputProps<TFormValues>) {
  const nameValue = useWatch({ control: form.control, name: nameField });
  const slugValue = useWatch({ control: form.control, name: slugField });
  const isManualEdit = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const autoGenerate = useCallback(() => {
    if (isManualEdit.current) return;
    if (!nameValue) {
      form.setValue(slugField, '' as any);
      return;
    }
    form.setValue(slugField, slugify(String(nameValue)) as any);
  }, [nameValue, form, slugField]);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(autoGenerate, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [autoGenerate]);
  function handleManualEdit(value: string) {
    isManualEdit.current = true;
    form.setValue(slugField, slugify(value) as any);
  }
  return (
    <Input
      value={slugValue ?? ''}
      onChange={(e) => handleManualEdit(e.target.value)}
      disabled={disabled}
    />
  );
}
