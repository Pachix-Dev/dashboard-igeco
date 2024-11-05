// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  console.log("Middleware ejecutado");

  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    jwt.verify(token, 'tu_secreto_jwt');
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'], // Define las rutas que deseas proteger
};
