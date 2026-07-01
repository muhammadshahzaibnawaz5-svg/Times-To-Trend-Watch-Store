import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}
export function FormField({ label, error, children, required, className }: FormFieldProps) {
  return (
    <div className={className}>
      {' '}
      <Label>
        {' '}
        {label} {required && <span className="text-destructive ml-1">*</span>}{' '}
      </Label>{' '}
      <div className="mt-1.5">{children}</div>{' '}
      {error && <p className="text-destructive mt-1 text-sm">{error}</p>}{' '}
    </div>
  );
}
