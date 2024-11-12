import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function GET(req: Request, { params }: { params: { id: number } }) {
  const [user] = await db.query('SELECT * FROM users WHERE id = ?', [params.id]);
  return user ? NextResponse.json(user) : NextResponse.json({ message: 'User not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  const { name, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);   
  await db.query('UPDATE users SET name = ?, email = ?, password = ?  WHERE id = ?', [name, email, hashedPassword, params.id]);
  return NextResponse.json({ message: 'User updated' });
}

export async function DELETE(req: Request, { params }: { params: { id: number } }) {
  await db.query('DELETE FROM users WHERE id = ?', [params.id]);
  return NextResponse.json({ message: 'User deleted' });
}