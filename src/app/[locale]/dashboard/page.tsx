import { getTranslations } from 'next-intl/server';
import { getDashboardSession, getGlobalStats } from '@/lib/actions/exhibitors';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AccountDisableLight } from '@/components/shared/AccountDisableLight';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getDashboardSession();
  
  if (!session) {
    redirect('/login');
  }

  const t = await getTranslations('Dashboard');

  // Obtener stats globales si es admin
  const globalStats = session.role === 'admin' ? await getGlobalStats() : null;

  // Check if profile is incomplete
  const isProfileIncomplete = !session.company || !session.stand || !session.description || !session.description_en || !session.phone || !session.address || !session.photo;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t('panel')}
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {t('welcome', {name: session.company ?? ''})}
          </h1>
          <p className="text-lg text-slate-400">{t('subtitle')}</p>
        </header>

        {/* Profile Completion Alert */}
        {isProfileIncomplete && (
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 shadow-lg shadow-amber-500/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-100">
                    {t('profileAlert.title')}
                  </h3>
                  <p className="mt-1 text-sm text-amber-200/80">
                    {t('profileAlert.description')}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                {t('profileAlert.action')}
              </Link>
            </div>
          </div>
        )}

        {/* Account Status Alert */}
        {session.status === 0 && (
          <AccountDisableLight />
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 shadow-xl shadow-blue-500/5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('stats.event')}
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {session.event || t('stats.noData')}
                </p>
              </div>
            </div>
          </div>

          {/* Event Dates Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 shadow-xl shadow-emerald-500/5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('stats.dates')}
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {t('stats.eventDates')}
                </p>
                <p className="mt-0.5 text-sm text-slate-300">
                  {t('stats.venue')}
                </p>
              </div>
            </div>
          </div>

          
        </div>

        {/* Global Stats - Admin Only */}
        {session.role === 'admin' && globalStats && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-purple-500/5 backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/20 text-purple-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('globalStats.title')} (RE+ MEXICO + ECOMONDO)</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Users */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('globalStats.totalUsers')}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {globalStats.totalUsers.toLocaleString()}
                </p>
              </div>
              {/* Total Students */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('globalStats.totalStudents')}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {globalStats.totalStudents.toLocaleString()}
                </p>
              </div>
              {/* Goal */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('globalStats.goal')}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {globalStats.goal.toLocaleString()}
                </p>
              </div>
              {/* Percentage */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('globalStats.percentage')}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {globalStats.percentage}%
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700/50">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min(globalStats.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Points Section */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">{t('important')}</h2>
          </div>
          <ul className="space-y-4">
            {[1, 2, 3].map((num) => (
              <li key={num} className="flex gap-4">
                <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-blue-500/20 text-xs font-bold text-blue-300">
                  {num}
                </div>
                <p className="text-slate-300 leading-relaxed">{t(`points.${num}`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
