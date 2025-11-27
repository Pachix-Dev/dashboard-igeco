import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { sanitizeString, sanitizeHTML } from '@/lib/validation';
import { RowDataPacket } from 'mysql2';

interface PonenteData {
  name: string;
  position: string;
  company: string;
  bio_esp?: string;
  bio_eng?: string;
  photo?: string;
}

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, name, position, company, photo FROM ponentes ORDER BY name ASC'
    );

    return NextResponse.json(
      { ponentes: rows },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error fetching ponentes:', err);
    return NextResponse.json(
      { message: 'Error al obtener los ponentes', ponentes: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, position, company, bio_esp, bio_eng, photo } = await req.json() as PonenteData;

    // Validar campos requeridos
    if (!name || !position || !company) {
      return NextResponse.json(
        { message: 'Los campos nombre, posición y empresa son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedPosition = sanitizeString(position, 100);
    const sanitizedCompany = sanitizeString(company, 100);
    const sanitizedBioEsp = bio_esp ? sanitizeHTML(bio_esp, 5000) : null;
    const sanitizedBioEng = bio_eng ? sanitizeHTML(bio_eng, 5000) : null;

    // Validar que las biografías no estén vacías si se proporcionan
    if ((sanitizedBioEsp && sanitizedBioEsp.trim().length === 0) || (sanitizedBioEng && sanitizedBioEng.trim().length === 0)) {
      return NextResponse.json(
        { message: 'Las biografías no pueden estar vacías' },
        { status: 400 }
      );
    }

    const uuid = uuidv4(); // Generar UUID único

    await db.query(
      'INSERT INTO ponentes (name, position, company, bio_esp, bio_eng, photo, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sanitizedName, sanitizedPosition, sanitizedCompany, sanitizedBioEsp, sanitizedBioEng, photo, uuid]
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
