export default function RequirementsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <header className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
          <div className="h-10 w-64 animate-pulse rounded bg-slate-800" />
          <div className="h-5 w-80 animate-pulse rounded bg-slate-800" />
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-800" />
            <div className="mt-3 h-7 w-48 animate-pulse rounded bg-slate-800" />
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
            <div className="mt-3 h-7 w-40 animate-pulse rounded bg-slate-800" />
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
            <div className="mt-3 h-7 w-56 animate-pulse rounded bg-slate-800" />
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-800" />
            <div className="mt-2 h-4 w-11/12 animate-pulse rounded bg-slate-800" />
            <div className="mt-2 h-4 w-9/12 animate-pulse rounded bg-slate-800" />
          </article>
        </div>
      </section>
    </main>
  );
}
