'use client';

import {useEffect, useMemo, useState} from 'react';
import {useSessionUser} from '@/store/session-user';
import {useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {SessionManager} from '@/components/scannleads/SessionManager';
import {BuySessionSlots} from '@/components/scannleads/BuySessionSlots';

export default function SessionLimit() {
  const t = useTranslations('SessionLimit');
  const locale = useLocale();
  const router = useRouter();
  const {userSession} = useSessionUser();

  const [activeSessions, setActiveSessions] = useState<number>(0);
  const maxSessions = userSession?.maxsessions ?? 0;

  useEffect(() => {
    // Consultar conteo actual de sesiones para mostrar progreso
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/dbcounts/sessions');
        const data = await res.json();
        setActiveSessions(Number(data?.count ?? 0));
      } catch (_) {
        setActiveSessions(0);
      }
    };
    fetchCount();
  }, []);

  const usagePct = useMemo(() => {
    if (maxSessions <= 0) return 100;
    return Math.min(100, Math.round((activeSessions / maxSessions) * 100));
  }, [activeSessions, maxSessions]);


  const closeAllSessions = async () => {
    try {
      const response = await fetch('/api/close-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userSession?.id })
      });

      if (response.ok) {
        router.push('/', { locale: locale as 'es' | 'en' | 'it' | undefined });
      }
    } catch (error) {
      console.error('Error: no se pudo cerrar sesiones');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('description1')}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard', { locale: locale as 'es' | 'en' | 'it' | undefined })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Dashboard
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{t('title')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('description2')}</p>
            </div>
            <button
              onClick={closeAllSessions}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
            >
              {t('closeAll')}
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{t('title')}</span>
              <span className="text-gray-600 dark:text-gray-300">{activeSessions}/{maxSessions}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>

          <div className="mt-8">
            <SessionManager />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-base font-semibold">Comprar slots</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aumenta tu límite para continuar usando el escáner en más dispositivos.</p>
          <div className="mt-4">
              <h3 className="text-base font-semibold">Comprar slots</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aumenta tu límite para continuar usando el escáner en más dispositivos.</p>
              <div className="mt-4">
                <BuySessionSlots currentSlots={maxSessions} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
