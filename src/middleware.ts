// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { jwtVerify } from 'jose';
import { roles } from './lib/db';



export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  try {
    const {payload} : any  = await jwtVerify(token,new TextEncoder().encode("tu_secreto_jwt"));
    const userRole = payload.role;       
    const userId = payload.id;
    const maxSessions = payload.maxsessions;       
    const pathname = new URL(req.url).pathname;

    if (pathname.startsWith('/dashboard/scan-leads')) {
      const response = await fetch(new URL('/api/check-sessions', req.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, maxSessions, token }),
      });

      const data = await response.json();

      if (data.limitReached) {
        return NextResponse.redirect(new URL('/session-limit', req.url));
      }
    }

    const allowedRoutes = roles[userRole as keyof typeof roles] as string[];
        
    if (!allowedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.redirect(new URL("/", req.url));
  }
  
}

export const config = {
  matcher: ['/dashboard/:path*'], // Define las rutas que deseas proteger
};
