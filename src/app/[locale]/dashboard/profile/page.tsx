'use client';

import { useSessionUser } from "app/store/session-user";
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';

export default function Profile() {
  const { userSession } = useSessionUser();
  const t = useTranslations('ProfilePage');

  // Mapeo de roles para mostrar badges
  const roleConfig = {
    admin: { 
      label: t('roles.admin'), 
      color: 'from-purple-500 to-pink-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      )
    },
    exhibitor: { 
      label: t('roles.exhibitor'), 
      color: 'from-blue-500 to-cyan-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 3.348 3h17.304a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>
      )
    },
    exhibitorplus: { 
      label: t('roles.exhibitorPlus'), 
      color: 'from-emerald-500 to-teal-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      )
    },
  };

  const currentRole = roleConfig[userSession?.role as keyof typeof roleConfig] || roleConfig.exhibitor;

  const [dbCounts, setDbCounts] = useState<{ totalUsers: number; percentage: number; totalStudents: number; goal: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadCounts() {
      if (userSession?.role !== 'admin') return;
      try {
        const res = await fetch('/api/dbcounts');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setDbCounts(data);
      } catch (err) {
        console.error('Error fetching db counts', err);
      }
    }
    loadCounts();
    return () => { mounted = false; };
  }, [userSession?.role]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t('header.subtitle')}
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{t('header.title')}</h1>
          </div>
          <p className="text-sm text-slate-400">
            {t('header.description')}
          </p>
        </header>

        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl shadow-blue-500/5 backdrop-blur">
          {/* Cover gradient */}
          <div className={`h-32 bg-gradient-to-r ${currentRole.color} relative`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
          </div>

          <div className="px-6 pb-8">
            {/* Avatar section */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 relative">
              <div className="relative">
                {/* Avatar circle con gradiente */}
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${currentRole.color} p-1 shadow-2xl shadow-blue-500/30`}>
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900"></div>
              </div>

              {/* Name and role */}
              <div className="flex-1 space-y-3 sm:mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{userSession?.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{userSession?.email}</p>
                </div>
                
                {/* Role badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${currentRole.color} shadow-lg`}>
                  {currentRole.icon}
                  <span className="text-sm font-semibold text-white">{currentRole.label}</span>
                </div>
              </div>
            </div>

            {/* DB totals - admin only */}
            {userSession?.role === 'admin' && dbCounts && (
              <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h3 className="text-xl text-slate-400 mb-3">Registros globales</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-6xl font-bold text-white">{dbCounts.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 font-bold">Total registros visitantes (RE+ MEXICO + ECOMONDO)</p>
                  </div>                  
                  <div className="sm:flex-1">
                    <p className="text-sm text-white mb-2">Progreso hacia meta ({dbCounts.goal.toLocaleString()})</p>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-emerald-400" style={{ width: `${Math.min(100, dbCounts.percentage)}%` }} />
                    </div>
                    <p className="text-2xl text-white mt-2">{dbCounts.percentage}% alcanzado</p>
                  </div>
                </div>                
              </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{userSession?.maxsessions || 0}</p>
                    <p className="text-xs text-slate-400">{t('stats.sessions')}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 3.348 3h17.304a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{userSession?.maxexhibitors || 0}</p>
                    <p className="text-xs text-slate-400">{t('stats.exhibitors')}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white truncate">{userSession?.event || 'N/A'}</p>
                    <p className="text-xs text-slate-400">{t('stats.event')}</p>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Info sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              {/* Email card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('info.email')}</p>
                    <p className="text-base font-semibold text-white truncate">{userSession?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span className="text-xs font-medium text-emerald-400">{t('info.verified')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company card */}
              {userSession?.company && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-400 mb-1">{t('info.company')}</p>
                      <p className="text-base font-semibold text-white truncate">{userSession?.company}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ID card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('info.userId')}</p>
                    <p className="text-base font-semibold text-white font-mono">#{userSession?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-200 mb-1">{t('banner.title')}</p>
              <p className="text-sm text-blue-300/80">
                {t('banner.message')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}