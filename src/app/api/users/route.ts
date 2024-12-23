import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();  
  const role = 'exhibitor';
  try{    
    const hashedPassword = await bcrypt.hash(password, 10);    
    await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);
    return NextResponse.json({ message: 'User created' }, { status: 201 });
  }catch(err){
    return NextResponse.json({ message: 'User not created' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  const { name, email, role } = await req.json();  
  await db.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, params.id]);
  return NextResponse.json({ message: 'User updated' });
}
