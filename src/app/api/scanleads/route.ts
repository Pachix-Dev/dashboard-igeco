import { NextResponse } from 'next/server';
import db, {db_re_eco} from '../../../lib/db';
import { isValidUUID } from '../../../lib/validation';

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

export async function POST(req: Request) {
  const {uuid, user_id, token} = await req.json() as ScanLeadRequest;
  try{
    // Validar UUID
    if (!isValidUUID(uuid)) {
      return NextResponse.json({ message: 'UUID inválido' }, { status: 400 });
    }

    const [existSession] = await db.query(
      'SELECT * FROM user_sessions WHERE user_id = ? AND session_token = ?',
      [user_id, token]
    ) as [DbRow[], any];

    if (existSession.length === 0) {
      return NextResponse.json({ message: 'Superaste el limite de sesiones / no tienes sesión' }, { status: 401 });
    }
    // Search in `users` table first
    let [existingRecord] = await db_re_eco.query('SELECT * FROM users WHERE uuid = ? LIMIT 1', [uuid]) as [DbRow[], any];

    // If not found, search in `users_ecomondo`
    if (existingRecord.length === 0) {
      [existingRecord] = await db_re_eco.query('SELECT * FROM users_ecomondo WHERE uuid = ? LIMIT 1', [uuid]) as [DbRow[], any];
      
      if (existingRecord.length === 0) {
        return NextResponse.json({ message: 'Record not found' }, { status: 404 });
      }
    }

    const record = existingRecord[0];
    

    const [existingLead] = await db.query('SELECT * FROM leads WHERE user_id = ? AND uuid = ?', [user_id, record.uuid]) as [DbRow[], any];
   
    if(existingLead.length > 0){
      return NextResponse.json({ message: 'Lead already exists' }, { status: 400 });
    }

    await db.query('INSERT INTO leads (uuid, user_id) VALUES (?, ?)', [record.uuid, user_id]);
    return NextResponse.json({ message: 'Lead created' }, { status: 201 });
  }catch(err){
    console.error(err);
    return NextResponse.json({ message: 'Lead not created' }, { status: 500 });
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
    return NextResponse.json({ message: 'Lead updated' });
  }catch(err){
    console.error('Error updating lead:', err);
    return NextResponse.json({ message: 'Lead not updated' }, { status: 500 });
  }
}