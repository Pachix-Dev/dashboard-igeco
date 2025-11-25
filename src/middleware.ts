import createMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

import {jwtVerify} from 'jose';
import {defaultLocale, localePrefix, locales} from './i18n/routing';
import {roles} from './lib/db';

const intlMiddleware = createMiddleware({
  defaultLocale,
  localePrefix,
  locales
});

const getLocalizedPath = (locale: string, path: string) => {
  if (localePrefix === 'as-needed' && locale === defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
};

export async function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);

  if (intlResponse?.redirected) {
    return intlResponse;
  }

  const token = req.cookies.get('access_token')?.value;
  const locale = req.nextUrl.locale ?? defaultLocale;
  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(es|en|it)(?=\/|$)/, '') || '/';

  if (!pathnameWithoutLocale.startsWith('/dashboard')) {
    return intlResponse ?? NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const {payload}: any = await jwtVerify(token, new TextEncoder().encode('tu_secreto_jwt'));
    const userRole = payload.role;
    const userId = payload.id;
    const maxSessions = payload.maxsessions;

    if (pathnameWithoutLocale.startsWith('/dashboard/scan-leads')) {
      const apiUrl = new URL('/api/check-sessions', req.nextUrl.origin);
      const response = await fetch(apiUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId, maxSessions, token})
      });

      const data = await response.json();

      if (data.limitReached) {
        const localizedPath = getLocalizedPath(locale, '/session-limit');
        const redirectUrl = `${req.nextUrl.origin}${localizedPath}`;
        return NextResponse.redirect(redirectUrl);
      }
    }

    const allowedRoutes = roles[userRole as keyof typeof roles];

    if (!allowedRoutes) {
      console.error('Invalid user role:', userRole);
      const localizedPath = getLocalizedPath(locale, '/');
      const redirectUrl = `${req.nextUrl.origin}${localizedPath}`;
      return NextResponse.redirect(redirectUrl);
    }

    if (!allowedRoutes.includes(pathnameWithoutLocale)) {
      const localizedPath = getLocalizedPath(locale, '/dashboard');
      const redirectUrl = `${req.nextUrl.origin}${localizedPath}`;
      return NextResponse.redirect(redirectUrl);
    }

    return intlResponse ?? NextResponse.next();
  } catch (error) {
    console.error('Error:', error);
    const localizedPath = getLocalizedPath(locale, '/');
    const redirectUrl = `${req.nextUrl.origin}${localizedPath}`;
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
