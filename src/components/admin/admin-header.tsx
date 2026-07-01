'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Command } from 'lucide-react';
import { logout } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/user';
export function AdminHeader({ user, profile }: { user: User; profile: Profile }) {
  const router = useRouter();
  async function handleLogout() {
    await logout();
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <header className="bg-background flex h-14 items-center justify-between border-b px-6">
      {' '}
      <div className="flex items-center gap-4">
        {' '}
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          {' '}
          View Store{' '}
        </Link>{' '}
        <kbd className="bg-muted text-muted-foreground hidden items-center gap-1 rounded-md border px-2 py-0.5 text-xs md:inline-flex">
          {' '}
          <Command className="h-3 w-3" />K{' '}
        </kbd>{' '}
      </div>{' '}
      <div className="flex items-center gap-4">
        {' '}
        <span className="text-muted-foreground text-sm">
          {profile.full_name || user.email}
        </span>{' '}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          {' '}
          <LogOut className="mr-2 h-4 w-4" /> Logout{' '}
        </Button>{' '}
      </div>{' '}
    </header>
  );
}
