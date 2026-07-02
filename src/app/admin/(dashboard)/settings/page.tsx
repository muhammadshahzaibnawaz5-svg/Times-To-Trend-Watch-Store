import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/components/admin/require-admin';
import { PageHeader } from '@/components/admin/page-header';
import { SettingsEditor } from './settings-editor';
async function SettingsData() {
  const supabase = createAdminClient();
  let settings;
  try {
    const result = await supabase
      .from('settings')
      .select('*')
      .order('key', { ascending: true });
    settings = result.data;
    console.log('[SettingsData] settings:', settings?.length);
  } catch (err) {
    console.error('[SettingsData] query failed:', err);
    settings = [];
  }
  return <SettingsEditor settings={settings || []} />;
}
export default async function AdminSettingsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {' '}
      <PageHeader title="Settings" description="Manage store configuration" />{' '}
      <Suspense
        fallback={
          <div className="space-y-4">
            {' '}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
            ))}{' '}
          </div>
        }
      >
        {' '}
        <SettingsData />{' '}
      </Suspense>{' '}
    </div>
  );
}
