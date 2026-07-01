'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Database, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusData {
  supabase_configured: boolean;
  tables_exist: boolean;
  admin_user_exists: boolean;
  error?: string;
}

export default function SetupPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  async function checkStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/setup/status');
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({
        supabase_configured: false,
        tables_exist: false,
        admin_user_exists: false,
        error: 'Failed to check setup status',
      });
    } finally {
      setLoading(false);
    }
  }

  async function runSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/setup/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedResult('success');
        await checkStatus();
      } else {
        setSeedResult(`error: ${data.error}`);
      }
    } catch {
      setSeedResult('error: Failed to seed database');
    } finally {
      setSeeding(false);
    }
  }

  useEffect(() => { checkStatus() }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-muted-foreground">Could not load setup status.</p>
        <Button onClick={checkStatus} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold">Database Setup</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure your Supabase database for production use.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-border bg-card rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">Setup Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {status.supabase_configured
                ? <CheckCircle className="h-5 w-5 text-green-500" />
                : <XCircle className="h-5 w-5 text-red-500" />}
              <div>
                <p className="text-sm font-medium">Supabase Configuration</p>
                <p className="text-muted-foreground text-xs">
                  {status.supabase_configured
                    ? 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set'
                    : 'Missing or placeholder Supabase credentials'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {status.tables_exist
                ? <CheckCircle className="h-5 w-5 text-green-500" />
                : <XCircle className="h-5 w-5 text-red-500" />}
              <div>
                <p className="text-sm font-medium">Database Tables</p>
                <p className="text-muted-foreground text-xs">
                  {status.tables_exist
                    ? 'All required tables exist'
                    : 'Run the SQL migration to create tables'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {status.admin_user_exists
                ? <CheckCircle className="h-5 w-5 text-green-500" />
                : <XCircle className="h-5 w-5 text-red-500" />}
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-muted-foreground text-xs">
                  {status.admin_user_exists
                    ? 'Admin user exists and is ready'
                    : 'No admin user found — seed the database to create one'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!status.supabase_configured && (
          <div className="border-border bg-amber-50 rounded-lg border p-5">
            <h2 className="mb-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="mr-1 inline h-4 w-4" />
              Supabase Not Configured
            </h2>
            <p className="text-amber-700 text-xs leading-relaxed">
              Set <code className="bg-amber-100 rounded px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code className="bg-amber-100 rounded px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
              in your Vercel project environment variables, then redeploy.
            </p>
          </div>
        )}

        {status.supabase_configured && !status.tables_exist && (
          <div className="border-border bg-card rounded-lg border p-5">
            <h2 className="mb-3 text-lg font-semibold">
              <Database className="mr-2 inline h-5 w-5" />
              Create Database Tables
            </h2>
            <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
              Copy the SQL below and paste it into your{' '}
              <a
                href="https://supabase.com/dashboard/project/_/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Supabase SQL Editor
              </a>
              , then click "Run".
            </p>
            <pre className="bg-muted max-h-60 overflow-auto rounded p-3 text-[11px] leading-relaxed">
              <code>{`
-- Open: https://supabase.com/dashboard
-- Go to: SQL Editor → New Query
-- Paste the full SQL from supabase/setup.sql
-- Click "Run"
              `.trim()}</code>
            </pre>
            <p className="text-muted-foreground mt-3 text-xs">
              The complete SQL file is at <code className="bg-muted rounded px-1">supabase/setup.sql</code> in the project
              repository. You can also copy it directly.
            </p>
          </div>
        )}

        {status.supabase_configured && status.tables_exist && !status.admin_user_exists && (
          <div className="border-border bg-card rounded-lg border p-5">
            <h2 className="mb-3 text-lg font-semibold">
              <Shield className="mr-2 inline h-5 w-5" />
              Seed Admin User & Data
            </h2>
            <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
              Create the admin user and seed initial data (categories, products, sections, etc.).
              Requires <code className="bg-muted rounded px-1">SUPABASE_SERVICE_ROLE_KEY</code> to be set as a Vercel
              environment variable.
            </p>
            <Button onClick={runSeed} disabled={seeding}>
              {seeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {seeding ? 'Seeding Database...' : 'Seed Database'}
            </Button>
            {seedResult === 'success' && (
              <p className="mt-3 text-xs text-green-600">Database seeded successfully!</p>
            )}
            {seedResult && seedResult !== 'success' && (
              <p className="mt-3 text-xs text-red-600">{seedResult}</p>
            )}
          </div>
        )}

        {status.supabase_configured && status.tables_exist && status.admin_user_exists && (
          <div className="border-border bg-green-50 rounded-lg border p-5 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
            <h2 className="mt-2 text-lg font-semibold text-green-800">All Set!</h2>
            <p className="text-green-700 text-xs leading-relaxed">
              Your database is configured and ready. Log in at{' '}
              <code className="bg-green-100 rounded px-1">/admin/login</code> with email{' '}
              <strong>admin@watchstore.com</strong> and password{' '}
              <strong>admin123</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
