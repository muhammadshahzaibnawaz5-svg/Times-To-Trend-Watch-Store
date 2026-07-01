import { Suspense } from 'react';
import { requireAdmin } from '@/components/admin/require-admin';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { CommandPalette } from '@/components/admin/command-palette';
import { EnvBanner } from '@/components/admin/env-banner';
function AdminLayoutSkeleton() {
  return (
    <div className="flex h-screen animate-pulse">
      {' '}
      <aside className="bg-background flex w-64 flex-col border-r">
        {' '}
        <div className="flex h-14 items-center border-b px-6 font-bold">Admin Panel</div>{' '}
        <nav className="flex-1 space-y-1 p-4">
          {' '}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-9 rounded-lg" />
          ))}{' '}
        </nav>{' '}
      </aside>{' '}
      <div className="flex flex-1 flex-col">
        {' '}
        <header className="bg-background flex h-14 items-center justify-between border-b px-6">
          {' '}
          <div className="bg-muted h-4 w-48 rounded" />{' '}
        </header>{' '}
        <main className="flex-1 overflow-y-auto p-6">
          {' '}
          <div className="space-y-6">
            {' '}
            <div className="bg-muted h-10 w-48 rounded" />{' '}
            <div className="bg-muted h-64 rounded-lg" />{' '}
          </div>{' '}
        </main>{' '}
      </div>{' '}
    </div>
  );
}
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireAdmin();
  return (
    <div className="flex h-screen">
      {' '}
      <AdminSidebar />{' '}
      <div className="flex flex-1 flex-col">
        {' '}
        <EnvBanner />
        <AdminHeader user={user} profile={profile} />{' '}
        <main className="flex-1 overflow-y-auto p-6">
          {' '}
          <Suspense fallback={<AdminLayoutSkeleton />}> {children} </Suspense>{' '}
        </main>{' '}
      </div>{' '}
      <CommandPalette />{' '}
    </div>
  );
}
