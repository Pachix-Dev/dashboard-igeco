import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const { name, position, companny, bio_esp, bio_eng, photo, linkedin, email, phone } = await req.json();

  try {
    const uuid = uuidv4(); // Generar UUID único

    await db.query(
      'INSERT INTO ponentes (name, position, companny, bio_esp, bio_eng, photo, linkedin, email, phone, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, position, companny, bio_esp, bio_eng, photo, linkedin, email, phone, uuid]
    );

    return NextResponse.json({ message: 'Ponente created', uuid }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Ponente not created' }, { status: 500 });
  }
}
