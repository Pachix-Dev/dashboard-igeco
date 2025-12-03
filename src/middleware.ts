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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!secret || !process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      const localizedPath = getLocalizedPath(locale, '/');
      const redirectUrl = `${req.nextUrl.origin}${localizedPath}`;
      return NextResponse.redirect(redirectUrl);
    }

    interface JWTPayload {
      id: number;
      email: string;
      role: string;
      maxsessions: number;
    }

    const {payload} = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userRole = payload.role;
    const userId = payload.id;
    const maxSessions = payload.maxsessions;

    // Edge runtime no permite mysql: delegamos validación a API Node
    const checkUrl = new URL('/api/check-sessions', req.url);
    const resp = await fetch(checkUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.allowed === false) {
        const localizedPath = getLocalizedPath(locale, '/dashboard/session-limit');
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
      const localizedPath = getLocalizedPath(locale, 'dashboard');
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
