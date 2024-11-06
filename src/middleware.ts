// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {

  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  try {
    await jwtVerify(token,new TextEncoder().encode("tu_secreto_jwt")
    );
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
}

export const config = {
  matcher: ['/dashboard/:path*', '/'], // Define las rutas que deseas proteger
};
