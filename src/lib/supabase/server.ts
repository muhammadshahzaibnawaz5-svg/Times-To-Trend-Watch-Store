import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isDevMode } from '@/lib/dev-auth';
import { devQuery } from '@/lib/dev-store';
import type { Database } from '@/types/database';

type SupabaseClient = ReturnType<typeof createSSRServerClient<Database>>;

function createDevMockClient(): SupabaseClient {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured in dev mode', name: '', status: 0 } }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      refreshSession: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      setSession: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      exchangeCodeForSession: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
      verifyOtp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithOtp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: { provider: '', url: '' }, error: null }),
      linkIdentity: () => Promise.resolve({ data: { user: null }, error: null }),
      unlinkIdentity: () => Promise.resolve({ data: { user: null }, error: null }),
      getIdentities: () => Promise.resolve({ data: { identities: [] }, error: null }),
      admin: {} as never,
      mfa: {} as never,
      reauthenticate: () => Promise.resolve({ data: { user: null }, error: null }),
      signAnonymously: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    } as unknown as SupabaseClient['auth'],
    from: (table: string) => devQuery(table) as never,
    rpc: () => Promise.resolve({ data: null, error: null }),
    channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }), subscribe: () => ({ unsubscribe: () => {} }) }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => Promise.resolve({ data: null, error: null }),
        createSignedUrl: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        move: () => Promise.resolve({ data: null, error: null }),
        copy: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    schema: '',
    realtime: {} as never,
    functions: {} as never,
    supabaseUrl: '',
    supabaseKey: '',
    headers: {},
    vet: 0,
    transaction: async () => devQuery('') as never,
  } as unknown as SupabaseClient;
}

export async function createServerClient() {
  if (isDevMode()) {
    return createDevMockClient();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookieStore = await cookies();

  return createSSRServerClient<Database>(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured — admin operations require it');
  }

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
