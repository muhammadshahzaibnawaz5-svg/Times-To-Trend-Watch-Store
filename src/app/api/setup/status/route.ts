import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { isDevMode } from '@/lib/dev-auth';

export async function GET() {
  const devMode = isDevMode();

  const result: {
    supabase_configured: boolean;
    tables_exist: boolean;
    admin_user_exists: boolean;
    error?: string;
  } = {
    supabase_configured: !devMode,
    tables_exist: false,
    admin_user_exists: false,
  };

  if (devMode) {
    result.tables_exist = true;
    result.admin_user_exists = true;
    return NextResponse.json(result);
  }

  try {
    const supabase = await createServerClient();

    const { error: profileError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    result.tables_exist = !profileError;

    if (result.tables_exist) {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      result.admin_user_exists = (count || 0) > 0;
    }

    return NextResponse.json(result);
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(result);
  }
}
