import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { sanitizeString, sanitizeHTML } from '@/lib/validation';
import { RowDataPacket } from 'mysql2';

interface PonenteData {
  name: string;
  position_esp: string;
  position_eng: string;
  company: string;
  bio_esp?: string;
  bio_eng?: string;
  photo?: string;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const hasStatusFilter = status === '0' || status === '1';
    const params: Array<string | number> = [];
    let query =
      'SELECT id, uuid, name AS speaker_name, COALESCE(position_esp, position) AS position, position_esp, position_eng, company, photo, bio_esp, bio_eng, impresiones, estatus FROM ponentes';

    if (hasStatusFilter) {
      query += ' WHERE estatus = ?';
      params.push(Number(status));
    } else if (status !== 'all') {
      query += ' WHERE estatus = 1';
    }

    query += ' ORDER BY name ASC';

    const [rows] = await db.query<RowDataPacket[]>(query, params);

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
    const { name, position_esp, position_eng, company, bio_esp, bio_eng, photo } = await req.json() as PonenteData;

    // Validar campos requeridos
    if (!name || !position_esp || !position_eng || !company) {
      return NextResponse.json(
        { message: 'Los campos nombre, cargo en español, cargo en inglés y empresa son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedPositionEsp = sanitizeString(position_esp, 100);
    const sanitizedPositionEng = sanitizeString(position_eng, 100);
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

    const [result]: any = await db.query(
      'INSERT INTO ponentes (name, position, position_esp, position_eng, company, bio_esp, bio_eng, photo, uuid, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [sanitizedName, sanitizedPositionEsp, sanitizedPositionEsp, sanitizedPositionEng, sanitizedCompany, sanitizedBioEsp, sanitizedBioEng, photo, uuid]
    );
         
    return NextResponse.json(
      { message: 'Ponente creado exitosamente', uuid, id: result.insertId, estatus: 1 },
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
