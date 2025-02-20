import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const {user_id, name, lastname, email, position, nationality} = await req.json();  
  try{   
    const uuid = uuidv4(); // Generar UUID único      
    await db.query('INSERT INTO exhibitors (user_id, name, lastname, email, position, nationality, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_id, name, lastname , email, position, nationality, uuid]);
    return NextResponse.json({ message: 'Exhibitor created' }, { status: 201 });
  }catch(err){
    return NextResponse.json({ message: 'Exhibitor not created' }, { status: 500 });
  }
}



