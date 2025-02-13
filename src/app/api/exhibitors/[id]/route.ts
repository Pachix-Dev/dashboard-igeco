import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(req: Request, { params }: { params: { id: number } }) {
  const [user] = await db.query('SELECT * FROM exhibitors WHERE id = ?', [params.id]);
  return user ? NextResponse.json(user) : NextResponse.json({ message: 'User not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  const { name, lastname, email, position, nationality } = await req.json();  
  await db.query('UPDATE exhibitors SET name = ?, lastname = ?, email = ?, position = ?, nationality = ? WHERE id = ?', [name, lastname, email, position, nationality,  params.id]);
  return NextResponse.json({ message: 'User updated' });
}

export async function DELETE(req: Request, { params }: { params: { id: number } }) {
  await db.query('DELETE FROM exhibitors WHERE id = ?', [params.id]);
  return NextResponse.json({ message: 'User deleted' });
}
