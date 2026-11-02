import { getTranslations } from 'next-intl/server'
import ExhibitorStats from './ExhibitorStats'

interface ExhibitorRegistrationClosedProps {
  stats: {
    total: number
    maxExhibitors: number
    remaining: number
    usagePercentage: number
  }
}

export default async function ExhibitorRegistrationClosed({
  stats,
}: ExhibitorRegistrationClosedProps) {
  const t = await getTranslations('ExhibitorsPage')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t('panel')}
          </p>

          <h1 className="text-3xl font-bold text-white">
            {t('title')}
          </h1>
        </header>

        <ExhibitorStats
          total={stats.total}
          maxExhibitors={stats.maxExhibitors}
          remaining={stats.remaining}
          usagePercentage={stats.usagePercentage}
          translations={{
            registered: t('stats.registered'),
            limit: t('stats.limit'),
            remaining: t('stats.remaining'),
            usage: t('stats.usage'),
          }}
        />

        <div className="rounded-3xl border border-amber-400/30 bg-amber-500/5 px-6 py-12 text-center shadow-xl sm:px-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-9 w-9"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-amber-300 sm:text-3xl">
            {t('registrationClosed.title')}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {t('registrationClosed.description')}
          </p>

          <div className="mx-auto mt-6 max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-base leading-relaxed">
            <p className="font-semibold text-white">
              {t('registrationClosed.onSite')}
            </p>
            <p className="text-slate-300">
              {t('registrationClosed.onSiteDetails')}
            </p>
            <p className="border-t border-amber-400/20 pt-4 text-amber-200">
              {t('registrationClosed.noReprints')}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
