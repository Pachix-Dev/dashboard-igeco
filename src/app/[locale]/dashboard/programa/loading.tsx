export default function ProgramaLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Header Skeleton */}
        <header className="space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
          <div className="h-10 w-80 animate-pulse rounded bg-slate-800" />
          <div className="h-6 w-64 animate-pulse rounded bg-slate-800" />
        </header>

        {/* Tabs Skeleton */}
        <div className="border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-10 w-28 animate-pulse rounded bg-slate-800" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />
              <div className="h-10 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-slate-800" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-36 animate-pulse rounded bg-slate-800" />
              <div className="h-10 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-10 w-2/3 animate-pulse rounded bg-slate-800" />
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[1,2,3].map((i) => (
              <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
