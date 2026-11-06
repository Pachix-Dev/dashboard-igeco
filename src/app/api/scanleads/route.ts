import { NextResponse } from 'next/server';
import db, {db_scanleads} from '@/lib/db';
import { isValidUUID } from '@/lib/validation';

interface ScanLeadRequest {
  uuid: string;
  user_id: number;
  token: string;
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

export async function POST(req: Request) {
  try{
    const input = await req.json().catch(() => null) as ScanLeadRequest | null;
    if (!input || !isValidUUID(input.uuid) || !Number.isInteger(input.user_id) || input.user_id <= 0) {
      return NextResponse.json({ message: 'QR o usuario inválido', status: 400 }, { status: 400 });
    }
    const {uuid, user_id} = input;

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
    // Return the source record as the created lead payload so the client can insert it locally
    return NextResponse.json({ message: 'Lead created', status: 201, lead: { ...record, notes: '' } }, { status: 201 });
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
  const {uuid, notes} = await req.json() as UpdateLeadRequest;
  try{
    // Validar UUID
    if (!isValidUUID(uuid)) {
      return NextResponse.json({ message: 'UUID inválido' }, { status: 400 });
    }

    // Sanitizar notas (máximo 1000 caracteres)
    const sanitizedNotes = notes ? notes.slice(0, 1000) : '';
         
    await db.query('UPDATE leads SET notes = ? WHERE uuid = ?', [sanitizedNotes, uuid]);
    return NextResponse.json({ message: 'Lead updated', status: 200, uuid });
  }catch(err){
    console.error('Error updating lead:', err);
    return NextResponse.json({ message: 'Lead not updated', status: 500 }, { status: 500 });
  }
}
