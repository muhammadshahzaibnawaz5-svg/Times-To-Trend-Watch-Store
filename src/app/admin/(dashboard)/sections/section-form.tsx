'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/shared/form-field';
import { SECTION_TYPE_LABELS } from '@/constants/section-types';
import { sectionSettingsComponents } from '@/sections/settings-registry';
import { sectionSchema } from '@/schemas/section-schema';
type FormValues = z.infer<typeof sectionSchema>;
interface SectionFormProps {
  formAction: (formData: FormData) => void;
  pending: boolean;
  defaultValues?: Partial<FormValues>;
  isEdit?: boolean;
}
const sectionTypes = Object.keys(SECTION_TYPE_LABELS) as [string, ...string[]];
export function SectionForm({ formAction, pending, defaultValues, isEdit }: SectionFormProps) {
  const [selectedType, setSelectedType] = useState<string>(defaultValues?.type || 'hero');
  const [settings, setSettings] = useState<Record<string, unknown>>(
    (defaultValues?.settings as Record<string, unknown>) || {},
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: '',
      type: 'hero',
      title: '',
      subtitle: '',
      isActive: true,
      sortOrder: 0,
      settings: {},
      ...defaultValues,
    },
  });
  const SettingsFormComponent = sectionSettingsComponents[selectedType];
  function handleTypeChange(value: string) {
    setSelectedType(value);
    setSettings({});
  }
  function handleSettingsChange(key: string, value: unknown) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }
  async function onSubmit(data: FormValues) {
    const fd = new FormData();
    fd.set('name', data.name);
    fd.set('type', data.type);
    fd.set('title', data.title || '');
    fd.set('subtitle', data.subtitle || '');
    fd.set('isActive', String(data.isActive));
    fd.set('sortOrder', String(data.sortOrder));
    fd.set('settings', JSON.stringify(settings));
    formAction(fd);
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormField label="Name" error={form.formState.errors.name?.message} required>
          {' '}
          <Input id="name" {...form.register('name')} />{' '}
        </FormField>{' '}
        <FormField label="Type" error={form.formState.errors.type?.message} required>
          {' '}
          <select
            id="type"
            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register('type', { onChange: (e) => handleTypeChange(e.target.value) })}
            disabled={isEdit}
          >
            {' '}
            {sectionTypes.map((type) => (
              <option key={type} value={type}>
                {' '}
                {SECTION_TYPE_LABELS[type] || type}{' '}
              </option>
            ))}{' '}
          </select>{' '}
        </FormField>{' '}
      </div>{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <FormField label="Title">
          {' '}
          <Input id="title" {...form.register('title')} />{' '}
        </FormField>{' '}
        <FormField label="Subtitle">
          {' '}
          <Input id="subtitle" {...form.register('subtitle')} />{' '}
        </FormField>{' '}
      </div>{' '}
      {SettingsFormComponent && (
        <div className="rounded-lg border p-4 cursor-pointer transition-shadow duration-300 hover:shadow-md">
          {' '}
          <h3 className="mb-4 text-sm font-medium">Section Settings</h3>{' '}
          <SettingsFormComponent settings={settings} onChange={handleSettingsChange} />{' '}
        </div>
      )}{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <div className="flex items-center gap-2">
          {' '}
          <Switch
            id="isActive"
            checked={form.watch('isActive')}
            onCheckedChange={(v) => form.setValue('isActive', v)}
          />{' '}
          <Label htmlFor="isActive">Active</Label>{' '}
        </div>{' '}
        <FormField label="Sort Order">
          {' '}
          <Input id="sortOrder" type="number" {...form.register('sortOrder')} />{' '}
        </FormField>{' '}
      </div>{' '}
      <div className="flex gap-2">
        {' '}
        <Button type="submit" disabled={pending}>
          {' '}
          {pending ? 'Saving...' : isEdit ? 'Update Section' : 'Create Section'}{' '}
        </Button>{' '}
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {' '}
          Cancel{' '}
        </Button>{' '}
      </div>{' '}
    </form>
  );
}
