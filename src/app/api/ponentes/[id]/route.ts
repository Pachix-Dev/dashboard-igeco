import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  const { name, position, company, bio_esp, bio_eng, photo, linkedin, email, phone } = await req.json();

  try {
    // Obtener el UUID actual del ponente
    const [rows]: any = await db.query('SELECT uuid FROM ponentes WHERE id = ?', [params.id]);
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const uuid = rows[0].uuid; // Extraer correctamente el UUID

    // Si hay una nueva imagen, asegurarnos de que se actualiza con el mismo UUID
    let updatedPhoto = photo;
    if (photo && !photo.includes(uuid)) {
      const extension = photo.split('.').pop();
      updatedPhoto = `/Ponentes/${uuid}.${extension}`;
    }

    // Actualizar los datos en la base de datos
    await db.query(
      'UPDATE ponentes SET name = ?, position = ?, company = ?, bio_esp = ?, bio_eng = ?, linkedin = ?, email = ?, phone = ? WHERE id = ?',
      [name, position, company, bio_esp, bio_eng,  linkedin, email, phone, params.id]
    );

    return NextResponse.json({ message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}