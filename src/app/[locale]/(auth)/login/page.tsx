'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/routing';
import {useState} from 'react';
import {useSessionUser} from '@/store/session-user';
import Link from 'next/link';

export default function Login() {
  const t = useTranslations('Login');
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setUserSession} = useSessionUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      });

      const data = await res.json();

      if (data.status) {
        setUserSession(data.user);
        router.push('/dashboard', {locale: locale as 'es' | 'en'});
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(t('serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      <div className="rounded-2xl border border-white border-opacity-20 bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">{t('title')}</h1>
        <p className="mb-8 text-center text-sm text-gray-300">{t('subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className="group">
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  // Permitir todos los caracteres especiales con Alt
                  if (e.altKey) {
                    e.stopPropagation();
                  }
                }}
                required
                className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                placeholder={t('passwordPlaceholder')}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500 border-opacity-50 bg-red-500 bg-opacity-20 p-3">
              <p className="text-sm font-medium text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <span>{t('submit')}</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">
              {t('noAccount')}{' '}
              <Link
                href="/register"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                {t('registerLink')}
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-gray-300">
          {t('privacyPrefix')}{' '}
          <a
            href="https://igeco.mx/aviso-de-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-semibold text-blue-400 hover:text-blue-300"
          >
            {t('privacyLink')}
          </a>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">{t('footer')}</p>
    </>
  );
}
