'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="text-center">
        {/* Número 404 animado */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 drop-shadow-2xl animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30">
            <h1 className="text-[12rem] font-black leading-none text-blue-500">
              404
            </h1>
          </div>
        </div>

        {/* Mensaje */}
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {t('title')}
        </h2>
        <p className="mb-8 max-w-md text-lg text-slate-400">
          {t('description')}
        </p>

        {/* Botón de regreso */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 transition-transform group-hover:-translate-x-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span>{t('backHome')}</span>
        </Link>

        {/* Decoración */}
        <div className="mt-16 flex justify-center gap-2 opacity-50">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{animationDelay: '0s'}}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{animationDelay: '0.1s'}}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
