export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Header Skeleton */}
        <header className="space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
          <div className="h-10 w-96 animate-pulse rounded bg-slate-800" />
          <div className="h-6 w-72 animate-pulse rounded bg-slate-800" />
        </header>

        {/* Alert Skeleton (optional, shown conditionally) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-64 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-800" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Card Skeleton */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
                <div className="h-6 w-40 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Event Dates Card Skeleton */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-36 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Important Points Section Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-800" />
            <div className="h-7 w-48 animate-pulse rounded bg-slate-800" />
          </div>
          <ul className="space-y-4">
            {[1, 2].map((num) => (
              <li key={num} className="flex gap-4">
                <div className="mt-1 h-6 w-6 animate-pulse rounded-lg bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
