'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/shared/image-upload';
import { sectionSettingsSchemas } from './settings-schemas';
import type { SettingsFormProps } from './settings-schemas';
export { sectionSettingsSchemas };
export type { SectionSettingsSchemaMap } from './settings-schemas';
function EmptySettingsForm(_props: SettingsFormProps) {
  return null;
}
function HeroSettingsForm({ settings, onChange }: SettingsFormProps) {
  return (
    <div className="space-y-4">
      {' '}
      <div className="space-y-2">
        {' '}
        <Label>Background Image</Label>{' '}
        <ImageUpload
          bucket="banners"
          existingUrls={settings.backgroundImage ? [settings.backgroundImage as string] : []}
          onImagesChange={(urls) => onChange('backgroundImage', urls[0] || undefined)}
          maxFiles={1}
        />{' '}
      </div>{' '}
    </div>
  );
}
function CountdownSettingsForm({ settings, onChange }: SettingsFormProps) {
  return (
    <div className="space-y-2">
      {' '}
      <Label htmlFor="targetDate">Target Date</Label>{' '}
      <Input
        id="targetDate"
        type="datetime-local"
        defaultValue={(settings.targetDate as string) || ''}
        onChange={(e) => onChange('targetDate', e.target.value || undefined)}
      />{' '}
    </div>
  );
}
function SaleBannerSettingsForm({ settings, onChange }: SettingsFormProps) {
  return (
    <div className="space-y-4">
      {' '}
      <div className="space-y-2">
        {' '}
        <Label>Background Image</Label>{' '}
        <ImageUpload
          bucket="banners"
          existingUrls={settings.backgroundImage ? [settings.backgroundImage as string] : []}
          onImagesChange={(urls) => onChange('backgroundImage', urls[0] || undefined)}
          maxFiles={1}
        />{' '}
      </div>{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {' '}
        <div className="space-y-2">
          {' '}
          <Label htmlFor="buttonText">Button Text</Label>{' '}
          <Input
            id="buttonText"
            defaultValue={(settings.buttonText as string) || ''}
            onChange={(e) => onChange('buttonText', e.target.value || undefined)}
          />{' '}
        </div>{' '}
        <div className="space-y-2">
          {' '}
          <Label htmlFor="buttonLink">Button Link</Label>{' '}
          <Input
            id="buttonLink"
            defaultValue={(settings.buttonLink as string) || ''}
            onChange={(e) => onChange('buttonLink', e.target.value || undefined)}
          />{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
function LimitSettingsForm({ settings, onChange }: SettingsFormProps) {
  return (
    <div className="space-y-2">
      {' '}
      <Label htmlFor="limit">Product Limit</Label>{' '}
      <Input
        id="limit"
        type="number"
        min={1}
        defaultValue={(settings.limit as string) || ''}
        onChange={(e) => onChange('limit', e.target.value ? Number(e.target.value) : undefined)}
      />{' '}
    </div>
  );
}
export const sectionSettingsComponents: Record<string, React.ComponentType<SettingsFormProps>> = {
  hero: HeroSettingsForm,
  featured_products: LimitSettingsForm,
  new_arrivals: LimitSettingsForm,
  best_sellers: LimitSettingsForm,
  trending: LimitSettingsForm,
  discount_products: LimitSettingsForm,
  category_grid: EmptySettingsForm,
  sale_banner: SaleBannerSettingsForm,
  countdown_offer: CountdownSettingsForm,
  newsletter: EmptySettingsForm,
  footer: EmptySettingsForm,
};
