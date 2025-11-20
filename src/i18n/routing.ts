import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const locales = ['es', 'en', 'it'] as const;

export const localePrefix = 'as-needed';
export const defaultLocale = 'es';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix
});

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({
    locales,
    localePrefix
  });

// Export useLocale for compatibility
export {useLocale} from 'next-intl';
export type Locale = (typeof locales)[number];
