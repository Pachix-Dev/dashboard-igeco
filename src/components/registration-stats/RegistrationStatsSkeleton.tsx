import { registrationTypes } from '@/lib/registration-stats';

export function RegistrationStatsSkeleton({ label }: { label: string }) {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
    >
      <span className="sr-only">{label}</span>
      <section aria-hidden="true" className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <header className="flex animate-pulse flex-col gap-4 motion-reduce:animate-none sm:flex-row sm:items-start sm:justify-between">
          <div className="w-full space-y-2">
            <div className="h-4 w-24 rounded bg-slate-800" />
            <div className="h-10 w-full max-w-md rounded bg-slate-800" />
            <div className="h-6 w-full max-w-xl rounded bg-slate-800" />
          </div>
          <div className="h-7 w-36 shrink-0 rounded-full bg-slate-800" />
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {registrationTypes.map(({ key }) => (
            <div key={key} className="min-w-0 animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 motion-reduce:animate-none lg:p-3 xl:p-4">
              <div className="flex min-h-10 items-start justify-between gap-2">
                <div className="h-5 w-24 max-w-full rounded bg-slate-800" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
              </div>
              <div className="mt-4 h-9 w-20 max-w-full rounded bg-slate-800 lg:h-8 2xl:h-9" />
              <div className="mt-2 h-4 w-full max-w-36 rounded bg-slate-800" />
            </div>
          ))}

          <div className="min-w-0 animate-pulse rounded-2xl border border-blue-400/30 bg-blue-500/10 p-5 motion-reduce:animate-none lg:p-3 xl:p-4">
            <div className="min-h-10">
              <div className="h-5 w-full max-w-36 rounded bg-slate-800" />
            </div>
            <div className="mt-4 h-9 w-24 max-w-full rounded bg-slate-800 lg:h-8 2xl:h-9" />
          </div>
        </div>

        <section className="animate-pulse rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-6 motion-reduce:animate-none">
          <div className="h-7 w-44 max-w-full rounded bg-slate-800" />
          <div className="mt-2 h-5 w-full max-w-xl rounded bg-slate-800" />
          <div className="mt-6 h-12 w-28 max-w-full rounded bg-slate-800" />
          <div className="mt-2 h-5 w-36 max-w-full rounded bg-slate-800" />
          <div className="mt-8 h-7 w-56 max-w-full rounded bg-slate-800" />
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
            <div className="grid grid-cols-2 gap-4 bg-white/5 px-4 py-3">
              <div className="h-5 w-20 max-w-full rounded bg-slate-800" />
              <div className="ml-auto h-5 w-16 max-w-full rounded bg-slate-800" />
            </div>
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-2 gap-4 border-t border-white/5 px-4 py-3">
                <div className="h-5 w-24 max-w-full rounded bg-slate-800" />
                <div className="ml-auto h-5 w-12 max-w-full rounded bg-slate-800" />
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
              <div className="h-5 w-56 max-w-full rounded bg-slate-800" />
              <div className="h-5 w-12 shrink-0 rounded bg-slate-800" />
            </div>
          </div>
          <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-800" />
        </section>
      </section>
    </main>
  );
}
