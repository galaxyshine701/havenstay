import { TriangleAlert } from 'lucide-react';
import { cardClass } from '../lib/ui';

// Shown instead of the app when the Supabase environment variables are missing.
export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 p-4">
      <div className={`${cardClass} w-full max-w-xl p-8`}>
        <TriangleAlert aria-hidden="true" className="h-8 w-8 text-gold-500" />
        <h1 className="mt-4 text-2xl font-semibold text-haven-900">Supabase is not connected yet</h1>
        <p className="mt-2 text-base text-ink-500">
          HavenStay needs two environment variables to talk to your Supabase project.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base text-ink-900">
          <li>
            Copy <code className="rounded bg-haven-50 px-1">.env.example</code> to{' '}
            <code className="rounded bg-haven-50 px-1">.env</code>
          </li>
          <li>
            Fill in <code className="rounded bg-haven-50 px-1">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-haven-50 px-1">VITE_SUPABASE_ANON_KEY</code> (Supabase,
            Project Settings, API)
          </li>
          <li>Stop the dev server and run <code className="rounded bg-haven-50 px-1">npm run dev</code> again</li>
        </ol>
        <p className="mt-4 text-sm text-ink-500">
          On Netlify, add the same two variables under Site settings, Environment variables, then
          redeploy.
        </p>
      </div>
    </div>
  );
}
