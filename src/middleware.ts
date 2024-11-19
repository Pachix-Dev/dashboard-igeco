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
    const {payload} = await jwtVerify(token,new TextEncoder().encode("tu_secreto_jwt"));
    const userRole = payload.role;
    const userId = payload.id;
    
    // Verificar y registrar la sesión a través de la API
    const sessionResponse = await fetch(new URL('/api/sessions', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, token }),
    });

    if (sessionResponse.status === 403) {
      return NextResponse.redirect(new URL('/session-limit', req.url)); // Redirigir a una página de límite de sesiones
    }

    
    const pathname = new URL(req.url).pathname;
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
