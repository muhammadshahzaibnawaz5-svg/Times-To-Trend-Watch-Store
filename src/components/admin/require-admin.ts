import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { isDevMode, DEV_ADMIN, DEV_MODE_KEY } from '@/lib/dev-auth';
import { initializeDevStore } from '@/lib/dev-store';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/user';

export async function requireAdmin() {
  console.log('[requireAdmin] started');

  if (isDevMode()) {
    console.log('[requireAdmin] dev mode');
    await initializeDevStore();
    const cookieStore = await cookies();
    const devSession = cookieStore.get(DEV_MODE_KEY);
    console.log(`[requireAdmin] dev session cookie: ${devSession?.value?.slice(0, 20)}...`);
    if (devSession?.value === DEV_ADMIN.id) {
      const devUser: User = {
        id: DEV_ADMIN.id,
        email: DEV_ADMIN.email,
        aud: '',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      };
      console.log('[requireAdmin] dev admin authenticated');
      return { user: devUser, profile: DEV_ADMIN.profile as Profile };
    }
    console.log('[requireAdmin] dev auth failed, redirect to login');
    redirect('/admin/login');
  }

  console.log('[requireAdmin] production mode');
  const baseSupabase = await createServerClient();
  const adminSupabase = createAdminClient();

  console.log('[requireAdmin] tables check using admin client');

  const { error: tablesCheck, count: tableCount } = await adminSupabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  console.log(`[requireAdmin] tables check result: error=${tablesCheck?.message ?? 'null'} count=${tableCount}`);

  if (tablesCheck) {
    console.log(`[requireAdmin] tables check FAILED — redirecting to /admin/setup (error: ${tablesCheck.message})`);
    redirect('/admin/setup');
  }

  const { data: { user }, error: getUserError } = await baseSupabase.auth.getUser();
  console.log(`[requireAdmin] getUser: user=${user?.email ?? 'null'} error=${getUserError?.message ?? 'null'}`);

  if (!user) {
    console.log('[requireAdmin] no user, redirect to /admin/login');
    redirect('/admin/login');
  }

  // Use admin client for profile query to bypass RLS
  const { data: profile, error: profileError } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  console.log(`[requireAdmin] profile query: error=${profileError?.message ?? 'null'} role=${profile?.role ?? 'null'}`);

  if (!profile || profile.role !== 'admin') {
    console.log(`[requireAdmin] NOT admin (role=${profile?.role}), redirect to /`);
    redirect('/');
  }

  console.log(`[requireAdmin] admin authenticated: ${user.email} (role=${profile.role})`);
  return { user, profile: profile as Profile };
}
