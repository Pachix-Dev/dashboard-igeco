'use client';

import {useLocale} from 'next-intl';
import {useRouter} from '@/i18n/routing';
import {useEffect} from 'react';

export default function Home() {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    router.replace('/login', {locale: locale as 'es' | 'en' | 'it'});
  }, [router, locale]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}
