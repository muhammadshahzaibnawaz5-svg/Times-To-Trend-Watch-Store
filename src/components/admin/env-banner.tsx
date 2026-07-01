import { isDevMode } from '@/lib/dev-auth';

export function EnvBanner() {
  const devMode = isDevMode();
  const hasKV = !!process.env.KV_URL;
  const isVercel = !!process.env.VERCEL;

  const needsSetup = devMode && isVercel && !hasKV;

  if (!needsSetup) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <p className="text-amber-800 text-xs leading-relaxed">
        <strong>Setup Required:</strong> Supabase or Vercel KV is not configured. CRUD data will reset
        between server instances.{' '}
        <a
          href="https://vercel.com/docs/storage/vercel-kv"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-900 underline underline-offset-2 hover:text-amber-950"
        >
          Add Vercel KV
        </a>{' '}
        for persistent storage, or set{' '}
        <code className="bg-amber-100 rounded px-1 py-0.5 text-[11px]">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{' '}
        and{' '}
        <code className="bg-amber-100 rounded px-1 py-0.5 text-[11px]">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{' '}
        in Vercel environment variables.
      </p>
    </div>
  );
}
