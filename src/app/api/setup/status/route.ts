import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase/server';
import { isDevMode } from '@/lib/dev-auth';
import type { Database } from '@/types/database';

export async function GET() {
  console.log('Setup status route called');
  const devMode = isDevMode();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const envDebug = {
    is_dev_mode: devMode,
    NEXT_PUBLIC_SUPABASE_URL_exists: !!supabaseUrl,
    NEXT_PUBLIC_SUPABASE_URL_value: supabaseUrl || 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY_exists: !!serviceKey,
    SUPABASE_SERVICE_ROLE_KEY_length: serviceKey?.length ?? 0,
  };

  const result: {
    supabase_configured: boolean;
    tables_exist: boolean;
    admin_user_exists: boolean;
    admin_count: number;
    tables_check_error?: string | null;
    admin_query_error?: string | null;
    rls_bypassed: boolean;
    env_debug: typeof envDebug;
    error?: string;
  } = {
    supabase_configured: !devMode,
    tables_exist: false,
    admin_user_exists: false,
    admin_count: 0,
    tables_check_error: null,
    admin_query_error: null,
    rls_bypassed: !!serviceKey,
    env_debug: envDebug,
  };

  if (devMode) {
    console.log('Dev mode — returning all true');
    result.tables_exist = true;
    result.admin_user_exists = true;
    return NextResponse.json(result);
  }

  if (!serviceKey) {
    console.log('SUPABASE_SERVICE_ROLE_KEY missing — falling back to anon client (RLS may block)');
  }

  try {
    // Use service role client to bypass RLS (setup must work before auth exists)
    const supabase = serviceKey && supabaseUrl
      ? createClient<Database>(supabaseUrl, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
      : await createServerClient();

    console.log('Supabase client type:', serviceKey ? 'service_role (bypasses RLS)' : 'anon (RLS active)');

    const { error: profileError, count: tablesCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    result.tables_check_error = profileError?.message ?? null;
    result.tables_exist = !profileError;

    console.log('Tables check — profiles SELECT result:', JSON.stringify({
      error: profileError?.message ?? null,
      count: tablesCount,
      tables_exist: result.tables_exist,
    }));

    if (result.tables_exist) {
      const { count, error: adminError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      result.admin_query_error = adminError?.message ?? null;
      result.admin_count = count ?? 0;
      result.admin_user_exists = (count || 0) > 0;

      console.log('Admin existence query result:', JSON.stringify({
        error: adminError?.message ?? null,
        count,
        admin_user_exists: result.admin_user_exists,
      }));
    }

    return NextResponse.json(result);
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Unknown error';
    console.log('Unhandled exception in status route:', err);
    return NextResponse.json(result, { status: 500 });
  }
}
