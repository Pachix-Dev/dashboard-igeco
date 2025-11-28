import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  const { name, position, company, bio_esp, bio_eng, photo } = await req.json();

  try {
    // Obtener el UUID actual del ponente
    const [rows]: any = await db.query('SELECT uuid FROM ponentes WHERE id = ?', [params.id]);
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Actualizar los datos en la base de datos
    await db.query(
      'UPDATE ponentes SET name = ?, position = ?, company = ?, bio_esp = ?, bio_eng = ?, photo = ? WHERE id = ?',
      [name, position, company, bio_esp, bio_eng, photo, params.id]
    );

    return NextResponse.json({ message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}