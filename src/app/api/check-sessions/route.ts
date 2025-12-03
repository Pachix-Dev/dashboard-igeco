import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  maxsessions: number;
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get('access_token')?.value;
    // Fallbacks: Authorization Bearer, query param ?token=
    if (!token) {
      const auth = (request.headers as any).get?.('authorization') || '';
      if (auth?.toLowerCase().startsWith('bearer ')) {
        token = auth.slice(7).trim();
      }
    }
    if (!token) {
      const url = new URL((request as any).url);
      token = url.searchParams.get('token') || undefined;
    }
    if (!token) {
      return NextResponse.json({ allowed: false, reason: 'no-token' }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;
    const maxSessions = payload.maxsessions ?? 0;

    const [rows]: any = await db.query(
      'SELECT COUNT(*) AS cnt FROM active_sessions WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
      [userId]
    );
    const activeCount = rows?.[0]?.cnt ? Number(rows[0].cnt) : 0;
    const allowed = activeCount <= maxSessions;
    return NextResponse.json({ allowed, activeCount, maxSessions }, { status: 200 });
  } catch (err) {
    console.error('Error checking sessions:', err);
    return NextResponse.json({ allowed: true }, { status: 200 });
  }
}
