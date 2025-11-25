import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const { name, position, company, bio_esp, bio_eng, photo } = await req.json();

    // Validar campos requeridos
    if (!name || !position || !company) {
      return NextResponse.json(
        { message: 'Los campos nombre, posición y empresa son requeridos' },
        { status: 400 }
      );
    }

    // Validar que las biografías no estén vacías si se proporcionan
    if ((bio_esp && bio_esp.trim().length === 0) || (bio_eng && bio_eng.trim().length === 0)) {
      return NextResponse.json(
        { message: 'Las biografías no pueden estar vacías' },
        { status: 400 }
      );
    }

    const uuid = uuidv4(); // Generar UUID único

    await db.query(
      'INSERT INTO ponentes (name, position, company, bio_esp, bio_eng, photo, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, position, company, bio_esp, bio_eng, photo, uuid]
    );

    return NextResponse.json(
      { message: 'Ponente creado exitosamente', uuid },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating ponente:', err);

    return NextResponse.json(
      { message: 'Error al crear el ponente. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
