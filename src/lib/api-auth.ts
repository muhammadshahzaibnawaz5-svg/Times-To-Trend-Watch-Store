import { createServerClient } from '@/lib/supabase/server';
import { isDevMode, DEV_ADMIN, DEV_MODE_KEY } from '@/lib/dev-auth';

function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('cookie') || '';
  return Object.fromEntries(
    cookieHeader.split(';').filter(Boolean).map((c) => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    }),
  );
}

export async function requireApiAuth(request: Request) {
  if (isDevMode()) {
    const cookies = parseCookies(request);
    if (cookies[DEV_MODE_KEY] === DEV_ADMIN.id) return;
    throw new Error('Unauthorized');
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
}

export async function getApiUserId(request: Request): Promise<string> {
  if (isDevMode()) {
    const cookies = parseCookies(request);
    if (cookies[DEV_MODE_KEY] === DEV_ADMIN.id) {
      return DEV_ADMIN.id;
    }
    throw new Error('Unauthorized');
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}
