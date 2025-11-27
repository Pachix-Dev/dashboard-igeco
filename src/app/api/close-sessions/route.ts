import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {id} = await req.json();
  if (id) {
    await db.query('DELETE FROM user_sessions WHERE user_id = ?', [id]);
  }

  const response = NextResponse.json({ message: 'Logout exitoso' });
  response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  return response;
}
