import { getFormatter, getTranslations } from 'next-intl/server';
import { getRegistrationStats } from '@/lib/actions/registration-stats';
import { registrationTypes, type RegistrationType } from '@/lib/registration-stats';

const cardStyles: Record<RegistrationType, { background: string; indicator: string }> = {
  visitors: {
    background: 'from-blue-500/10 to-cyan-500/10',
    indicator: 'bg-blue-400',
  },
  exhibitors: {
    background: 'from-emerald-500/10 to-teal-500/10',
    indicator: 'bg-emerald-400',
  },
  speakers: {
    background: 'from-purple-500/10 to-fuchsia-500/10',
    indicator: 'bg-purple-400',
  },
  vip: {
    background: 'from-amber-500/10 to-orange-500/10',
    indicator: 'bg-amber-400',
  },
  media: {
    background: 'from-rose-500/10 to-pink-500/10',
    indicator: 'bg-rose-400',
  },
};

export async function RegistrationStatsModule() {
  const [t, format, result] = await Promise.all([
    getTranslations('RegistrationStatsPage'),
    getFormatter({ locale: 'es-MX' }),
    getRegistrationStats(),
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t('panel')}
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{t('title')}</h1>
          <p className="text-slate-400">{t('subtitle')}</p>
        </div>
        <span className="self-start rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
          {t('adminOnly')}
        </span>
      </header>

      {!result.success && (
        <div role="alert" className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6">
          <h2 className="font-semibold text-rose-200">{t('error.title')}</h2>
          <p className="mt-2 text-sm text-rose-100/80">{t(`error.${result.error}`)}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {registrationTypes.map(({ key }) => (
          <div
            key={key}
            className={`flex min-w-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-br ${cardStyles[key].background} p-5 shadow-lg lg:p-3 xl:p-4`}
          >
            <div className="flex min-h-10 items-start justify-between gap-2">
              <h2 className="min-w-0 break-words text-sm font-semibold text-slate-300 lg:text-xs xl:text-sm">{t(`types.${key}`)}</h2>
              <span aria-hidden="true" className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${cardStyles[key].indicator}`} />
            </div>
            <p aria-label={result.success ? undefined : t('unavailable')} className="mt-4 break-words text-3xl font-bold tabular-nums tracking-tight text-white lg:text-2xl 2xl:text-3xl">
              {result.success ? format.number(result.data.counts[key]) : '—'}
            </p>
            <p className="mt-2 text-xs text-slate-400">{t(result.success ? 'registered' : 'unavailable')}</p>
          </div>
        ))}

        <div className="flex min-w-0 flex-col rounded-2xl border border-blue-400/30 bg-blue-500/10 p-5 shadow-lg shadow-blue-500/5 lg:p-3 xl:p-4">
          <h2 className="min-h-10 break-words text-sm font-semibold text-blue-200 lg:text-xs xl:text-sm">{t('total')}</h2>
          <p aria-label={result.success ? undefined : t('unavailable')} className="mt-4 break-words text-3xl font-bold tabular-nums tracking-tight text-white lg:text-2xl 2xl:text-3xl">
            {result.success ? format.number(result.data.total) : '—'}
          </p>
        </div>
      </div>
    </section>
  );
}
