'use client';
import { type FieldValues, type UseFormReturn, type FieldPath } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
interface FormSwitchProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  disabled?: boolean;
  className?: string;
}
export function FormSwitch<TFormValues extends FieldValues>({
  form,
  name,
  label,
  disabled,
  className,
}: FormSwitchProps<TFormValues>) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      {' '}
      <Switch
        checked={form.watch(name) ?? false}
        onCheckedChange={(checked) => form.setValue(name, checked as any)}
        disabled={disabled}
      />{' '}
      <Label className="cursor-pointer">{label}</Label>{' '}
    </div>
  );
}
