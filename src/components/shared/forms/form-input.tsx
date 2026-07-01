'use client';
import { type FieldValues, type UseFormReturn, type FieldPath } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/form-field';
interface FormInputProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
export function FormInput<TFormValues extends FieldValues>({
  form,
  name,
  label,
  required,
  type,
  placeholder,
  disabled,
  className,
}: FormInputProps<TFormValues>) {
  const error = form.formState.errors[name]?.message as string | undefined;
  return (
    <FormField label={label} error={error} required={required} className={className}>
      {' '}
      <Input
        type={type ?? 'text'}
        placeholder={placeholder}
        disabled={disabled}
        {...form.register(name, { valueAsNumber: type === 'number' })}
      />{' '}
    </FormField>
  );
}
