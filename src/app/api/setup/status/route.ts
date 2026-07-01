import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase/server';
import { isDevMode } from '@/lib/dev-auth';
import type { Database } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const trace: string[] = [];
  const log = (msg: string) => { console.log(msg); trace.push(msg); };

  log('=== Setup status route called ===');
  const devMode = isDevMode();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  log(`isDevMode: ${devMode}`);
  log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl || 'MISSING'}`);
  log(`SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? `exists (length=${serviceKey.length})` : 'MISSING'}`);

  const response: Record<string, unknown> = {
    supabase_configured: !devMode,
    tables_exist: false,
    admin_user_exists: false,
    admin_count: 0,
    _diagnostic: { trace: [] as string[] },
  };

  if (devMode) {
    log('Dev mode — returning all true (no actual Supabase query)');
    response.tables_exist = true;
    response.admin_user_exists = true;
    (response._diagnostic as Record<string, unknown>).trace = trace;
    return NextResponse.json(response);
  }

  try {
    let supabase;

    if (serviceKey && supabaseUrl) {
      supabase = createClient<Database>(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      log('Using service_role client (bypasses RLS)');
    } else {
      supabase = await createServerClient();
      log('Using anon client (RLS may block unauthenticated requests)');
    }

    // --- Table existence check ---
    log('Running table existence check: .from("profiles").select("id", { count: "exact", head: true })');
    const tableQuery = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    log(`Table check response — error: ${tableQuery.error?.message ?? 'null'}, count: ${tableQuery.count}, data: ${JSON.stringify(tableQuery.data)}`);
    response.tables_check_error = tableQuery.error?.message ?? null;
    response.tables_count = tableQuery.count;
    response.tables_exist = !tableQuery.error;
    response._table_response = {
      error: tableQuery.error,
      count: tableQuery.count,
      data: tableQuery.data,
    };

    if (tableQuery.error) {
      log(`Table check FAILED — cannot proceed to admin check`);
      (response._diagnostic as Record<string, unknown>).trace = trace;
      return NextResponse.json(response);
    }

    // --- Admin existence check ---
    log('Running admin existence check: .from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin")');
    const adminQuery = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    log(`Admin query response — error: ${adminQuery.error?.message ?? 'null'}, count: ${adminQuery.count}, data: ${JSON.stringify(adminQuery.data)}`);
    response.admin_query_error = adminQuery.error?.message ?? null;
    response.admin_count = adminQuery.count;
    response.admin_user_exists = (adminQuery.count ?? 0) > 0;
    response._admin_response = {
      error: adminQuery.error,
      count: adminQuery.count,
      data: adminQuery.data,
    };

    log(`admin_count=${adminQuery.count}, admin_user_exists=${response.admin_user_exists}`);

    if ((adminQuery.count ?? 0) > 0) {
      response.admin_user_exists = true;
      log('Forcing admin_user_exists=true because count > 0');
    }

    response._query_raw_count = adminQuery.count;
    response._query_count_type = typeof adminQuery.count;
    response._is_count_gt_zero = (adminQuery.count ?? 0) > 0;

    (response._diagnostic as Record<string, unknown>).trace = trace;
    return NextResponse.json(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    log(`Unhandled exception: ${msg}`);
    log(`Stack: ${stack}`);
    response.error = msg;
    response.error_stack = stack;
    (response._diagnostic as Record<string, unknown>).trace = trace;
    return NextResponse.json(response, { status: 500 });
  }
}
