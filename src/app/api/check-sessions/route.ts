import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const {userId, maxSessions } = await req.json();  
  try{         
    const [sessions]: any = await db.query(
        'SELECT COUNT(*) as sessionCount FROM user_sessions WHERE user_id = ?',
        [userId]
      );
    if (sessions[0].sessionCount >= maxSessions) {
    return NextResponse.json({ limitReached: true }, { status: 200 });
    }
    return NextResponse.json({ limitReached: false}, { status: 200 });
  }catch(err){
    return NextResponse.json({ message: 'Error Check session' }, { status: 500 });
  }
}
