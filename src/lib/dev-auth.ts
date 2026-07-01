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
  if (process.env.NODE_ENV === 'production') return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return url === 'https://xxxxxxxxxxxxxx.supabase.co' || !url.startsWith('https://');
}
