import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { isDevMode, DEV_ADMIN, DEV_MODE_KEY } from '@/lib/dev-auth';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/user';

export async function requireAdmin() {
  if (isDevMode()) {
    const cookieStore = await cookies();
    const devSession = cookieStore.get(DEV_MODE_KEY);
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
      return { user: devUser, profile: DEV_ADMIN.profile as Profile };
    }
    redirect('/admin/login');
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/');

  return { user, profile: profile as Profile };
}
