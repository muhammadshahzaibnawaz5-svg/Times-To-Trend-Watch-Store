import { isDevMode } from '@/lib/dev-auth';

export function EnvBanner() {
  const devMode = isDevMode();
  const hasKV = !!process.env.KV_URL;

  const needsSetup = devMode && !hasKV;

  if (!needsSetup) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <p className="text-amber-800 text-xs leading-relaxed">
        <strong>Notice:</strong> Running in development mode with in-memory storage.
        CRUD data will reset between server instances.{' '}
        <a
          href="/admin/setup"
          className="text-amber-900 underline underline-offset-2 hover:text-amber-950"
        >
          Setup Supabase
        </a>{' '}
        for persistent production storage, or{' '}
        <a
          href="https://vercel.com/docs/storage/vercel-kv"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-900 underline underline-offset-2 hover:text-amber-950"
        >
          add Vercel KV
        </a>{' '}
        for Redis-backed persistence.
      </p>
    </div>
  );
}
