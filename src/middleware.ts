import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { isDevMode, DEV_ADMIN, DEV_MODE_KEY } from '@/lib/dev-auth';
import { rateLimit } from '@/lib/rate-limiter';

const isSupabaseConfigured =
  !isDevMode() &&
  process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const devSession = request.cookies.get(DEV_MODE_KEY);

  console.log(`[middleware] ${request.method} ${pathname} | devMode=${isDevMode()} | supabaseConfigured=${isSupabaseConfigured}`);

  // Rate limiting on auth paths
  if (pathname.startsWith('/admin/login')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const result = rateLimit(`auth:${ip}`, 10, 60000);
    if (!result.success) {
      return new NextResponse('Too many requests. Please try again later.', { status: 429 });
    }
  }

  // Dev mode: skip real auth checks, use cookie
  if (isDevMode() && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const isValid = devSession?.value === DEV_ADMIN.id;
    console.log(`[middleware] dev mode admin check: cookie=${devSession?.value?.slice(0, 20)}... isValid=${isValid}`);
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  if (isSupabaseConfigured && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value),
            );
          },
        },
      },
    );

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log(`[middleware] getUser for ${pathname}: user=${user?.email ?? 'null'} error=${error?.message ?? 'null'}`);
      if (!user) {
        console.log(`[middleware] redirect to /admin/login — no user`);
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (err) {
      console.log(`[middleware] getUser exception:`, err);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
