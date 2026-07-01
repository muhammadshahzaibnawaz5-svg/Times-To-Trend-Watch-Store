'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateSetting } from '@/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
interface Setting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}
export function SettingsEditor({ settings }: { settings: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const s of settings) {
      initial[s.key] = JSON.stringify(s.value, null, 2);
    }
    return initial;
  });
  async function handleSave(settingKey: string) {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(values[settingKey] || '{}');
    } catch {
      toast.error('Invalid JSON value');
      return;
    }
    const result = await updateSetting(settingKey, parsed);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${settingKey} updated`);
    }
  }
  if (settings.length === 0) {
    return (
      <Card>
        {' '}
        <CardContent className="text-muted-foreground py-8 text-center text-sm">
          {' '}
          No settings configured yet.{' '}
        </CardContent>{' '}
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {' '}
      {settings.map((setting) => (
        <Card key={setting.id}>
          {' '}
          <CardHeader>
            {' '}
            <CardTitle className="text-lg capitalize">
              {setting.key.replace(/_/g, ' ')}
            </CardTitle>{' '}
          </CardHeader>{' '}
          <CardContent className="space-y-3">
            {' '}
            <div className="space-y-2">
              {' '}
              <Label>Value (JSON)</Label>{' '}
              <Input
                value={values[setting.key] || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [setting.key]: e.target.value }))}
              />{' '}
            </div>{' '}
            <div className="flex items-center justify-between">
              {' '}
              <span className="text-muted-foreground text-xs">
                {' '}
                Last updated: {new Date(setting.updated_at).toLocaleDateString()}{' '}
              </span>{' '}
              <Button size="sm" onClick={() => handleSave(setting.key)}>
                {' '}
                Save{' '}
              </Button>{' '}
            </div>{' '}
          </CardContent>{' '}
        </Card>
      ))}{' '}
    </div>
  );
}
