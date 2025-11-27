import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(req: Request) {
    const { id } = await req.json();    
    await db.query('UPDATE ponentes SET impresiones = impresiones + 1  WHERE id = ?', [id]);    
    return NextResponse.json({ message: 'User updated' });
  }