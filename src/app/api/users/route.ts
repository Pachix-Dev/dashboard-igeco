import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password, rol } = await req.json();
  const hashedPassword = bcrypt.hashSync(password, 10);
  await db.query('INSERT INTO users (name, email, password, rol) VALUES (?, ?, ?)', [name, email, hashedPassword, rol]);
  return NextResponse.json({ message: 'User created' }, { status: 201 });
}
