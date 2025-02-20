import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const { name, lastname, companny, categoria, escenario, email, event } = await req.json();
  
  try {
    const uuid = uuidv4(); // Generar UUID único

    await db.query(
      'INSERT INTO ponentes ( name, lastname, companny, categoria, escenario, email, event, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ name, lastname, companny, categoria, escenario, email, event, uuid]
    );

    return NextResponse.json({ message: 'Ponente created', uuid }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Ponente not created' }, { status: 500 });
  }
}
