'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {useState} from 'react';
import {Link, usePathname, useRouter} from 'app/i18n/routing';
import {useSessionUser} from 'app/store/session-user';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Menu');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const {userSession, clear} = useSessionUser();

  const handleNavigate = () => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    clear();
    router.push('/', {locale});
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const normalizedPath =
    pathname && ['es', 'en'].some((lc) => pathname.startsWith(`/${lc}/`))
      ? pathname.slice(3)
      : pathname || '/';

  const getLinkClasses = (path: string) => {
    return normalizedPath === path
      ? 'border-blue-500 text-blue-700 bg-blue-50'
      : 'text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700';
  };

  const switchLocale = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname || '/', {locale: nextLocale});
  };

  return (
    <>
      <div className="flex items-center justify-between border-b px-4 py-2 lg:hidden">
        <Link href="/dashboard" onClick={handleNavigate}>
          <Image
            src="/img/deutschemesselogo.webp"
            alt="logo"
            width={50}
            height={32}
            className="rounded-lg"
          />
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="rounded-md border px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            {locale.toUpperCase()}
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      <aside
        className={`flex h-screen flex-col justify-between border-r bg-white transition-transform lg:block ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <ul>
          <li className="hidden items-center justify-center py-4 lg:flex">
            <Link href="/dashboard" onClick={handleNavigate}>
              <Image
                src="/img/deutschemesselogo.webp"
                alt="logo"
                width={50}
                height={32}
                className="rounded-lg"
                priority
              />
            </Link>
          </li>
          <li className="hidden px-4 pb-2 lg:block">
            <button
              onClick={switchLocale}
              className="w-full rounded-md border px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              {locale === 'es' ? 'ES' : 'EN'}
            </button>
          </li>

          {userSession?.role === 'admin' && (
            <>
              <li>
                <Link
                  onClick={handleNavigate}
                  href="/dashboard/usuarios"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${getLinkClasses('/dashboard/usuarios')}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{t('users')}</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleNavigate}
                  href="/dashboard/ponentes"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${getLinkClasses('/dashboard/ponentes')}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  <span className="text-sm font-medium">{t('speakers')}</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleNavigate}
                  href="/dashboard/exhibitors"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${getLinkClasses('/dashboard/exhibitors')}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  <span className="text-sm font-medium">{t('exhibitors')}</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleNavigate}
                  href="/dashboard/programa"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${getLinkClasses('/dashboard/programa')}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>

                  <span className="text-sm font-medium">{t('program')}</span>
                </Link>
              </li>
            </>
          )}

          {(userSession?.role === 'exhibitorplus' || userSession?.role === 'admin') && (
            <li>
              <Link
                onClick={handleNavigate}
                href="/dashboard/scan-leads"
                className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${getLinkClasses('/dashboard/scan-leads')}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                  />
                </svg>
                <span className="text-sm font-medium">{t('scanLeads')}</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              onClick={handleNavigate}
              href="/dashboard/profile"
              className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${getLinkClasses('/dashboard/profile')}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

              <span className="text-sm font-medium">{t('profile')}</span>
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
          </svg>
          {t('logout')}
        </button>
      </aside>
    </>
  );
}
