'use client';
import { type FieldValues, type UseFormReturn, type FieldPath } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/shared/form-field';
interface FormTextareaProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
export function FormTextarea<TFormValues extends FieldValues>({
  form,
  name,
  label,
  required,
  placeholder,
  disabled,
  className,
}: FormTextareaProps<TFormValues>) {
  const error = form.formState.errors[name]?.message as string | undefined;
  return (
    <FormField label={label} error={error} required={required} className={className}>
      {' '}
      <Textarea placeholder={placeholder} disabled={disabled} {...form.register(name)} />{' '}
    </FormField>
  );
}
