import type { Profile } from '@/types/user';

export const DEV_MODE_KEY = 'dev_admin_session';

export const DEV_ADMIN = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@timestotrend.com',
  password: 'admin123',
  profile: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@timestotrend.com',
    full_name: 'Admin User',
    avatar_url: null,
    phone: '+92-300-1234567',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } satisfies Profile,
};

export function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  // Dev mode when Supabase isn't properly configured
  if (!url || !anonKey) return true;
  if (url === 'https://xxxxxxxxxxxxxx.supabase.co') return true;
  if (url.includes('your-project')) return true;
  if (anonKey === 'your-anon-key' || anonKey.includes('your-anon')) return true;
  if (!url.startsWith('https://')) return true;
  return false;
}
