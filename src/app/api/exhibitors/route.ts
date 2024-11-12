import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const {user_id, name, email, phone, position } = await req.json();  
  try{         
    await db.query('INSERT INTO exhibitors (user_id, name, email, phone, position) VALUES (?, ?, ?, ?, ?)', [user_id, name, email, phone, position]);
    return NextResponse.json({ message: 'Exhibitor created' }, { status: 201 });
  }catch(err){
    return NextResponse.json({ message: 'Exhibitor not created' }, { status: 500 });
  }
}
