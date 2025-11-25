'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'app/i18n/routing';
import {useState} from 'react';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: 'en' | 'es' | 'it') => {
    router.replace(pathname || '/', {locale: newLocale});
    setIsOpen(false);
  };

  const locales: Array<{ code: 'en' | 'es' | 'it'; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'it', label: 'Italiano' }
  ];

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20 transition-all"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>{currentLocale.label}</span>
        <svg 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-white/20 bg-gray-800/95 backdrop-blur-lg shadow-xl z-20">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-md last:rounded-b-md ${
                  locale === loc.code
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-200 hover:bg-white/10'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
