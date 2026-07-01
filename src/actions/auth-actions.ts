'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limiter';
import { loginSchema } from '@/schemas/auth-schema';
import { isDevMode, DEV_ADMIN, DEV_MODE_KEY } from '@/lib/dev-auth';
import type { ActionResult } from '@/types/common';

async function checkAuthRateLimit(action: 'login') {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
  return rateLimit(`auth-action:${action}:${ip}`, 5, 60_000);
}

export async function login(formData: FormData): Promise<ActionResult<null>> {
  try {
    const rateLimitResult = await checkAuthRateLimit('login');
    if (!rateLimitResult.success) {
      return { data: null, error: 'Too many login attempts. Please try again later.' };
    }

    const parsed = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!parsed.success) {
      return { data: null, error: parsed.error.errors[0].message };
    }

    if (isDevMode()) {
      if (
        parsed.data.email.toLowerCase().trim() === DEV_ADMIN.email.toLowerCase() &&
        parsed.data.password === DEV_ADMIN.password
      ) {
        const cookieStore = await cookies();
        cookieStore.set(DEV_MODE_KEY, DEV_ADMIN.id, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 8,
          path: '/',
        });
        return { data: null, error: null };
      }
      return { data: null, error: 'Invalid email or password' };
    }

    console.log(`[login] attempting sign in with ${parsed.data.email}`);
    const supabase = await createServerClient();
    const { data: signInData, error } = await supabase.auth.signInWithPassword(parsed.data);

    console.log(`[login] signInWithPassword result: error=${error?.message ?? 'null'} user=${signInData?.user?.email ?? 'null'} session=${!!signInData?.session}`);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'An unexpected error occurred during login.',
    };
  }
}

export async function logout(): Promise<ActionResult<null>> {
  try {
    if (isDevMode()) {
      const cookieStore = await cookies();
      cookieStore.set(DEV_MODE_KEY, '', { maxAge: 0, path: '/' });
      return { data: null, error: null };
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'An unexpected error occurred during logout.',
    };
  }
}
