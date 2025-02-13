import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password, role, maxsessions,  maxexhibitors, event} = await req.json();    
  try{    
    const hashedPassword = await bcrypt.hash(password, 10);    
    await db.query('INSERT INTO users (name, email, password, role, maxsessions, maxexhibitors, event) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, hashedPassword, role, maxsessions, maxexhibitors, event]);
    return NextResponse.json({ message: 'User created' }, { status: 201 });
  }catch(err){    
    return NextResponse.json({ message: 'User not created' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { id, password } = await req.json();  
  try{
    const hashedPassword = await bcrypt.hash(password, 10);    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return NextResponse.json({ message: 'Password updated sucess', status: true }, {status: 200});
  }
  catch(err){
    return NextResponse.json({ message: 'Error try later', status: false }, { status: 500 });
  }
 
}
