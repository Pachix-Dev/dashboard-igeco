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

const buildRedirectUrl = (req: NextRequest, locale: string, path: string) => {
  const url = req.nextUrl.clone();
  url.pathname = getLocalizedPath(locale, path);
  url.search = '';
  return url;
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
    return NextResponse.redirect(buildRedirectUrl(req, locale, '/'));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!secret || !process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.redirect(buildRedirectUrl(req, locale, '/'));
    }

    interface JWTPayload {
      id: number;
      email: string;
      role: string;
      status?: number;
      document_penalty_required?: number;
      document_penalty_paid?: number;
      document_penalty_waived?: number;
      document_penalty_locked_by_admin?: number;
      maxsessions: number;
    }

    const {payload} = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userRole = payload.role;
    const userStatus = Number(payload.status ?? 1);
    const isPenaltyRequired = Number(payload.document_penalty_required ?? 0) === 1;
    const isPenaltyPaid = Number(payload.document_penalty_paid ?? 0) === 1;
    const isPenaltyWaived = Number(payload.document_penalty_waived ?? 0) === 1;
    const isPenaltyLocked = Number(payload.document_penalty_locked_by_admin ?? 0) === 1;
    const shouldShowReactivationPayment =
      isPenaltyLocked || (isPenaltyRequired && !isPenaltyPaid && !isPenaltyWaived);
    const reactivationRoute = '/dashboard/reactivation-payment';
    const inactiveAllowedRoutes = ['/dashboard', '/dashboard/profile'];
     
    const allowedRoutes = roles[userRole as keyof typeof roles];

    if (!allowedRoutes) {
      console.error('Invalid user role:', userRole);
      return NextResponse.redirect(buildRedirectUrl(req, locale, '/'));
    }

    const requiresReactivationFlow = userRole === 'exhibitor' || userRole === 'exhibitorplus';

    if (requiresReactivationFlow && userStatus !== 1) {
      if (!inactiveAllowedRoutes.includes(pathnameWithoutLocale)) {
        return NextResponse.redirect(buildRedirectUrl(req, locale, '/dashboard'));
      }
      if (pathnameWithoutLocale === reactivationRoute) {
        return NextResponse.redirect(buildRedirectUrl(req, locale, '/dashboard'));
      }
    }

    if (requiresReactivationFlow && shouldShowReactivationPayment && pathnameWithoutLocale === reactivationRoute) {
      return intlResponse ?? NextResponse.next();
    }

    if (requiresReactivationFlow && !shouldShowReactivationPayment && pathnameWithoutLocale === reactivationRoute) {
      return NextResponse.redirect(buildRedirectUrl(req, locale, '/dashboard'));
    }

    if (!allowedRoutes.includes(pathnameWithoutLocale)) {
      return NextResponse.redirect(buildRedirectUrl(req, locale, '/dashboard'));
    }

    return intlResponse ?? NextResponse.next();
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.redirect(buildRedirectUrl(req, locale, '/'));
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
