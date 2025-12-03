import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No access token' }, { status: 401 });
    }
    const secretStr = process.env.JWT_SECRET;
    if (!secretStr) {
      return NextResponse.json({ message: 'JWT not configured' }, { status: 500 });
    }
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;

    const body = await req.json();
    const {
      name,
      company,
      event,
      description,
      description_en,
      address,
      photo,
    } = body;

    // Basic validation
    if (!name || !company || !event) {
      return NextResponse.json({ message: 'name, company y event son requeridos' }, { status: 400 });
    }

    await db.query(
      'UPDATE users SET name = ?, company = ?, event = ?, description = ?, description_en = ?, address = ?, photo = ? WHERE id = ?',
      [name, company, event, description || null, description_en || null, address || null, photo || null, userId]
    );

    return NextResponse.json({ message: 'Perfil actualizado' });
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return NextResponse.json({ message: 'Error al actualizar perfil' }, { status: 500 });
  }
}
