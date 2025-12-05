'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { logout } from '@/lib/actions/logout';

interface MenuTranslations {
  profile: string;
  users: string;
  speakers: string;
  badges: string;
  program: string;
  scanLeads: string;
  logout: string;
}

export default function MenuClient({ translations, role, languageSelector }: { translations: MenuTranslations; role: string | null; languageSelector: React.ReactNode }) {
  const t = (key: keyof MenuTranslations) => translations[key];
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleNavigate = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/', { locale: locale as 'es' | 'en' });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const normalizedPath =
    pathname && ['es', 'en'].some((lc) => pathname.startsWith(`/${lc}/`))
      ? pathname.slice(3)
      : pathname || '/';

  const getLinkClasses = (path: string) => {
    const base =
      'group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition';
    const active =
      'border-blue-500/40 bg-gradient-to-r from-blue-600/20 via-blue-500/15 to-cyan-500/10 text-white shadow-lg shadow-blue-500/20';
    const idle =
      'border-white/5 text-slate-300 hover:border-white/15 hover:bg-white/5 hover:text-white';

    return `${base} ${normalizedPath === path ? active : idle}`;
  };

  return (
    <>
      {/* Header mobile */}
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3 text-white lg:hidden">
        <Link href="/dashboard" onClick={handleNavigate} className="flex items-center gap-2">
            <Image
            src="/img/italian.png"
            alt="logo"
            width={34}
            height={34}
            className="rounded-lg shadow-lg shadow-blue-500/20"            
          />
          <Image
            src="/img/deutschemesselogo.webp"
            alt="logo"
            width={34}
            height={34}
            className="rounded-lg shadow-lg shadow-blue-500/20"            
          />
          <span className="text-sm font-semibold text-slate-200">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          {languageSelector}
          <button
            onClick={toggleMenu}
            aria-expanded={isOpen}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-white transition hover:border-blue-400/60 hover:bg-blue-500/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={toggleMenu} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between w-[280px] border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-2xl shadow-blue-500/10 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:block'
        }`}
      >
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          <div className="hidden flex-col gap-3 lg:flex">
            <Link href="/dashboard" onClick={handleNavigate} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
               <Image src="/img/italian.png" alt="logo" width={25} height={25} className="rounded-lg" priority /> 
              <Image src="/img/deutschemesselogo.webp" alt="logo" width={30} height={30} className="rounded-lg" priority />
              <div>
                <p className="text-xs font-semibold text-slate-400">Dashboard</p>
                <p className="text-sm font-bold text-white">{t('profile')}</p>
              </div>
            </Link>
            {languageSelector}
          </div>

          {role === 'admin' && (
            <>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
              <ul className="space-y-3">
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/usuarios" className={getLinkClasses('/dashboard/usuarios')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                      </span>
                      <span>{t('users')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/ponentes" className={getLinkClasses('/dashboard/ponentes')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                      <span>{t('speakers')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/exhibitors" className={getLinkClasses('/dashboard/exhibitors')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">                        
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                        </svg>
                      </span>
                      <span>{t('badges')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/programa" className={getLinkClasses('/dashboard/programa')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg>                        
                      </span>
                      <span>{t('program')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/scan-leads" className={getLinkClasses('/dashboard/scan-leads')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                        </svg>
                      </span>
                      <span>{t('scanLeads')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </>
          )}

          {role === 'exhibitor' && (
            <>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Exhibitor</p>
              <ul className="space-y-3">
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/exhibitors" className={getLinkClasses('/dashboard/exhibitors')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 0 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                        </svg>
                      </span>
                      <span>{t('badges')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/scan-leads" className={getLinkClasses('/dashboard/scan-leads')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                        </svg>
                      </span>
                      <span>{t('scanLeads')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </>
          )}

          {role === 'editor' && (
            <>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Editor</p>
              <ul className="space-y-3">
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/ponentes" className={getLinkClasses('/dashboard/ponentes')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 0 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                        </svg>
                      </span>
                      <span>{t('speakers')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link onClick={handleNavigate} href="/dashboard/programa" className={getLinkClasses('/dashboard/programa')}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                        </svg>
                      </span>
                      <span>{t('program')}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </>
          )}

          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Cuenta</p>
          <ul className="space-y-3">
            <li>
              <Link onClick={handleNavigate} href="/dashboard/profile" className={getLinkClasses('/dashboard/profile')}>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                    </svg>
                  </span>
                  <span>{t('profile')}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-slate-500 transition group-hover:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                </svg>
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-rose-200 ring-1 ring-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
              </span>
              {t('logout')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
