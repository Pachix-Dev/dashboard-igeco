'use client';

import { useTranslations } from 'next-intl';

type RequirementsSkeletonProps = {
  showExhibitors?: boolean;
};

export function RequirementsSkeleton({ showExhibitors = false }: RequirementsSkeletonProps) {
  const t = useTranslations('Requirements.messages');

  return (
    <div
      role="status"
      aria-busy="true"
      className={showExhibitors ? 'grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]' : undefined}
    >
      <span className="sr-only">{t('loading_requirements')}</span>

      {showExhibitors && (
        <aside aria-hidden="true" className="min-w-0 space-y-4 self-start rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse motion-reduce:animate-none">
          <div className="space-y-2">
            <div className="h-6 w-4/5 rounded bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-800" />
          </div>
          <div className="h-11 w-full rounded-xl bg-slate-800" />

          {[1, 2, 3, 4].map((bucket) => (
            <div key={bucket} className="space-y-3 rounded-xl border border-white/10 bg-slate-950/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-2/3 rounded bg-slate-800" />
                <div className="h-5 w-8 rounded-full bg-slate-800" />
              </div>
              {[1, 2].map((item) => (
                <div key={item} className="space-y-2 rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <div className="h-4 w-4/5 rounded bg-slate-700" />
                  <div className="h-3 w-2/3 rounded bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          ))}
        </aside>
      )}

      <div aria-hidden="true" className="min-w-0 space-y-6 animate-pulse motion-reduce:animate-none">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-3 w-40 max-w-full rounded bg-slate-800" />
          <div className="h-8 w-2/3 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800" />
          <div className="h-12 w-full rounded-xl bg-slate-800" />
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-3 w-32 max-w-full rounded bg-slate-800" />
          <div className="h-12 w-full rounded-xl bg-slate-800" />
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-6 w-56 max-w-full rounded bg-slate-800" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-3 rounded-xl border border-white/10 bg-slate-900/70 p-3">
                <div className="h-4 w-full rounded bg-slate-800" />
                <div className="h-6 w-1/2 rounded bg-slate-700" />
              </div>
            ))}
          </div>
          <div className="h-3 w-20 rounded bg-slate-800" />
          <div className="h-2 w-full rounded-full bg-slate-800" />
        </div>

        {[1, 2].map((section) => (
          <div key={section} className="space-y-4">
            <div className="h-6 w-56 max-w-full rounded bg-slate-800" />
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2].map((document) => (
                <div key={document} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-800" />
                  <div className="h-4 w-full rounded bg-slate-800" />
                  <div className="h-4 w-2/3 rounded bg-slate-800" />
                  <div className="h-24 w-full rounded-xl bg-slate-800" />
                  <div className="flex gap-2">
                    <div className="h-9 w-24 rounded-lg bg-slate-700" />
                    <div className="h-9 w-24 rounded-lg bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-6 w-40 max-w-full rounded bg-slate-800" />
          <div className="h-20 w-full rounded-xl bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
