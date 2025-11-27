import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  if (token) {
    await db.query('DELETE FROM user_sessions WHERE session_token = ?', [token]);
  }

  const response = NextResponse.json({ message: 'Logout exitoso' });
  response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  return response;
}
