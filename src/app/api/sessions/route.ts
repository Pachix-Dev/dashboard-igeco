import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const { userId, token } = await req.json();

  try {
    // Check active sessions
    const [sessions]: any = await db.query(
      'SELECT COUNT(*) as sessionCount FROM user_sessions WHERE user_id = ?',
      [userId]
    );

    if (sessions[0].sessionCount >= 2) {
      return NextResponse.json({ redirectTo: '/session-limit' }, { status: 403 });
    }

    // Check if the token already exists
    const [existingSession]: any = await db.query(
      'SELECT * FROM user_sessions WHERE session_token = ?',
      [token]
    );

    if (existingSession.length === 0) {
      // Register new session
      await db.query(
        'INSERT INTO user_sessions (user_id, session_token) VALUES (?, ?)',
        [userId, token]
      );
    }

    return NextResponse.json({ message: 'Session registered' }, { status: 200 });
  } catch (error) {
    console.error('Database Error: ', error);
    return NextResponse.json({ message: 'Failed to register session' }, { status: 500 });
  }
}