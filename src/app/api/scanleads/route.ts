import { NextResponse } from 'next/server';
import db, {db_scanleads} from '@/lib/db';
import { isValidUUID } from '@/lib/validation';
import { getSession } from '@/lib/actions/exhibitors';
import type { ResultSetHeader } from 'mysql2';

interface ScanLeadRequest {
  uuid: string;
  user_id?: number;
}

interface UpdateLeadRequest {
  uuid: string;
  notes: string;
}

interface DbRow {
  [key: string]: any;
}

function duplicateLeadResponse() {
  return NextResponse.json(
    { message: 'Lead already exists', status: 409, code: 'LEAD_ALREADY_EXISTS' },
    { status: 409 }
  );
}

async function getScannerSession(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Sesión requerida', status: 401 }, { status: 401 });
  if (Number(session.status) !== 1 || !['admin', 'exhibitorplus'].includes(session.role) || Number(session.scanleads_purchased) !== 1) {
    return NextResponse.json({ message: 'Acceso no autorizado', status: 403 }, { status: 403 });
  }
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(process.env.NEXT_PUBLIC_APP_URL || req.url).origin) {
    return NextResponse.json({ message: 'Origen no autorizado', status: 403 }, { status: 403 });
  }
  return session;
}

export async function POST(req: Request) {
  try{
    const session = await getScannerSession(req);
    if (session instanceof NextResponse) return session;
    const input = await req.json().catch(() => null) as ScanLeadRequest | null;
    if (!input || !isValidUUID(input.uuid)) {
      return NextResponse.json({ message: 'QR o usuario inválido', status: 400 }, { status: 400 });
    }
    if (input.user_id !== undefined && input.user_id !== session.id) {
      return NextResponse.json({ message: 'Acceso no autorizado', status: 403 }, { status: 403 });
    }
    const {uuid} = input;
    const user_id = session.id;

    // UUID is unique across the entire leads table, including other accounts.
    const [existingLead] = await db.query(
      'SELECT id FROM leads WHERE uuid = ? LIMIT 1', [uuid]
    ) as [DbRow[], any];
    if (existingLead.length > 0) {
      return duplicateLeadResponse();
    }
   
    let [existingRecord] = await db_scanleads.query("SELECT uuid, name, paternSurname, email, company,  position, phone, municipality, state, postalCode, country, created_at FROM visitors_ste_2026 WHERE uuid = ? LIMIT 1", [uuid]) as [DbRow[], any];

    if (existingRecord.length === 0) {
      [existingRecord] = await db.query('SELECT * FROM exhibitors WHERE uuid = ? LIMIT 1', [uuid]) as [DbRow[], any];
    }

    if (existingRecord.length === 0) {
      [existingRecord] = await db.query('SELECT * FROM ponentes WHERE uuid = ? AND estatus = 1 LIMIT 1', [uuid]) as [DbRow[], any];
    }

    if (existingRecord.length === 0) {
      return NextResponse.json({ message: 'Record not found', status: 404 }, { status: 404 });
    }

    const record = existingRecord[0];
    

    await db.query('INSERT INTO leads (uuid, user_id, notes) VALUES (?, ?, ?)', [record.uuid, user_id, '']);
    const [savedLead] = await db.query(
      'SELECT UNIX_TIMESTAMP(created_at) * 1000 AS created_at_ms FROM leads WHERE uuid = ? AND user_id = ? LIMIT 1',
      [record.uuid, user_id]
    ) as [DbRow[], any];
    // Return the source record as the created lead payload so the client can insert it locally
    return NextResponse.json({ message: 'Lead created', status: 201, lead: {
      ...record,
      notes: '',
      created_at: new Date(Number(savedLead[0].created_at_ms)).toISOString(),
    } }, { status: 201 });
  }catch(err){
    // The unique index also protects against simultaneous scans passing the check above.
    if ((err as { code?: string })?.code === 'ER_DUP_ENTRY') {
      return duplicateLeadResponse();
    }
    console.error(err);
    return NextResponse.json({ message: 'Lead not created', status: 500 }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try{
    const session = await getScannerSession(req);
    if (session instanceof NextResponse) return session;
    const input = await req.json().catch(() => null) as UpdateLeadRequest | null;
    if (!input || typeof input.notes !== 'string') {
      return NextResponse.json({ message: 'Datos inválidos', status: 400 }, { status: 400 });
    }
    const {uuid, notes} = input;
    // Validar UUID
    if (!isValidUUID(uuid)) {
      return NextResponse.json({ message: 'UUID inválido' }, { status: 400 });
    }

    // Sanitizar notas (máximo 1000 caracteres)
    const sanitizedNotes = notes ? notes.slice(0, 1000) : '';
         
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE leads SET notes = ? WHERE uuid = ? AND user_id = ?', [sanitizedNotes, uuid, session.id]
    );
    if (!result.affectedRows) return NextResponse.json({ message: 'Lead no encontrado', status: 404 }, { status: 404 });
    return NextResponse.json({ message: 'Lead updated', status: 200, uuid, notes: sanitizedNotes });
  }catch(err){
    console.error('Error updating lead:', err);
    return NextResponse.json({ message: 'Lead not updated', status: 500 }, { status: 500 });
  }
}
