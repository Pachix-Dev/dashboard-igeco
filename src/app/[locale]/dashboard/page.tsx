'use client';

import {useTranslations} from 'next-intl';
import {useSessionUser} from '@/store/session-user';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const {userSession} = useSessionUser();

  return (
    <section className="container mx-auto my-10 px-4">
      <h1 className="text-center text-4xl font-extrabold">
        {t('welcome', {name: userSession?.name ?? ''})}
      </h1>

      <p className="mt-20 text-2xl font-bold">{t('important')}</p>
      <ul className="ml-5 mt-10 list-disc space-y-3 ps-5">
        <li>{t('points.1')}</li>
        <li>{t('points.2')}</li>
        <li>{t('points.3')}</li>
        <li>{t('points.4')}</li>
      </ul>
    </section>
  );
}
