import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const { name, position, company, bio_esp, bio_eng, photo } = await req.json();

  try {
    const uuid = uuidv4(); // Generar UUID único

    await db.query(
      'INSERT INTO ponentes (name, position, company, bio_esp, bio_eng, photo, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, position, company, bio_esp, bio_eng, photo, uuid]
    );

    return NextResponse.json({ message: 'Ponente created', uuid }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Ponente not created' }, { status: 500 });
  }
}
