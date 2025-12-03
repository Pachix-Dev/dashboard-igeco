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

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get('access_token')?.value;
    if (!token) {
      const auth = (request.headers as any).get?.('authorization') || '';
      if (auth?.toLowerCase().startsWith('bearer ')) token = auth.slice(7).trim();
    }
    if (!token) {
      const url = new URL((request as any).url);
      token = url.searchParams.get('token') || undefined;
    }
    if (!token) {
      return NextResponse.json({ ok: false, reason: 'no-token' }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;

    const ipAddress = (request.headers as any).get?.('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const userAgent = (request.headers as any).get?.('user-agent') || '';
    const deviceInfo = (request.headers as any).get?.('sec-ch-ua-platform') || 'unknown';

    await db.query(
      'INSERT INTO active_sessions (user_id, session_token, device_info, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)\n      ON DUPLICATE KEY UPDATE last_activity = CURRENT_TIMESTAMP, device_info = VALUES(device_info), ip_address = VALUES(ip_address), user_agent = VALUES(user_agent)',
      [userId, token, deviceInfo, ipAddress, userAgent]
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Error updating active session:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
