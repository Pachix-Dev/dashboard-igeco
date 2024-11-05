import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout exitoso' });
  response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  return response;
}
