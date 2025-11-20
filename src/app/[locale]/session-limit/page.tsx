'use client';

import {useSessionUser} from 'app/store/session-user';
import {useRouter} from 'app/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';

export default function SessionLimit() {
  const t = useTranslations('SessionLimit');
  const locale = useLocale();
  const router = useRouter();
  const {userSession} = useSessionUser();

  const closeAllSessions = async () => {
    try {
      const response = await fetch('/api/close-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: userSession?.id})
      });

      if (response.ok) {
        router.push('/', { locale: locale as 'es' | 'en' | undefined });
      }
    } catch (error) {
      console.error('Error: no se pudo cerrar sesiones');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">{t('title')}</h1>
      <p>{t('description1')}</p>
      <p>{t('description2')}</p>
      <button
        onClick={closeAllSessions}
        className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        {t('closeAll')}
      </button>
    </div>
  );
}
