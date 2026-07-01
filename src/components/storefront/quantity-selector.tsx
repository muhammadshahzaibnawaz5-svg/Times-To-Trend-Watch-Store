'use client';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
type QuantitySelectorProps = {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};
export function QuantitySelector({
  value: externalValue,
  min = 1,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  const [internalValue, setInternalValue] = useState(externalValue ?? 1);
  const value = onChange !== undefined ? (externalValue ?? 1) : internalValue;
  function handleChange(newValue: number) {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }
  return (
    <div className="flex items-center gap-2">
      {' '}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10"
        disabled={value <= min}
        onClick={() => handleChange(value - 1)}
      >
        {' '}
        <Minus className="h-3 w-3" />{' '}
      </Button>{' '}
      <span className="flex h-10 w-12 items-center justify-center rounded-md border text-sm font-medium tabular-nums">
        {' '}
        {value}{' '}
      </span>{' '}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10"
        disabled={value >= max}
        onClick={() => handleChange(value + 1)}
      >
        {' '}
        <Plus className="h-3 w-3" />{' '}
      </Button>{' '}
    </div>
  );
}
