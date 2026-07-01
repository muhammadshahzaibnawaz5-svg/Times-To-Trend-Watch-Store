'use client';
import { type FieldValues, type UseFormReturn, type FieldPath } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/shared/form-field';
interface Option {
  value: string;
  label: string;
}
interface FormSelectProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}
export function FormSelect<TFormValues extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
  className,
  onValueChange,
}: FormSelectProps<TFormValues>) {
  const error = form.formState.errors[name]?.message as string | undefined;
  return (
    <FormField label={label} error={error} required={required} className={className}>
      {' '}
      <Select
        onValueChange={(value) => {
          form.setValue(name, value as any);
          onValueChange?.(value);
        }}
        defaultValue={form.getValues(name) ?? ''}
        disabled={disabled}
      >
        {' '}
        <SelectTrigger>
          {' '}
          <SelectValue placeholder={placeholder ?? 'Select...'} />{' '}
        </SelectTrigger>{' '}
        <SelectContent>
          {' '}
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {' '}
              {opt.label}{' '}
            </SelectItem>
          ))}{' '}
        </SelectContent>{' '}
      </Select>{' '}
    </FormField>
  );
}
