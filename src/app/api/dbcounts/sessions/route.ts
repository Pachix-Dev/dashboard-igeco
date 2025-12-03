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

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No token', count: 0 }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;

    const [rows]: any = await db.query(
      'SELECT COUNT(*) AS cnt FROM active_sessions WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
      [userId]
    );
    const count = rows?.[0]?.cnt ? Number(rows[0].cnt) : 0;
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error('Error fetching sessions count:', err);
    return NextResponse.json({ message: 'Error fetching count', count: 0 }, { status: 500 });
  }
}
