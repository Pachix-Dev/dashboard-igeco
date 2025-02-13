import { NextResponse } from 'next/server';
import db, {db_re_eco} from '../../../lib/db';

export async function POST(req: Request) {
  const {uuid, user_id} = await req.json();  
  try{         
    // Search in `users` table first
    let [existingRecord]: any = await db_re_eco.query('SELECT * FROM users WHERE uuid = ? LIMIT 1', [uuid]);

    // If not found, search in `users_ecomondo`
    if (existingRecord.length === 0) {
      [existingRecord] = await db_re_eco.query('SELECT * FROM users_ecomondo WHERE uuid = ? LIMIT 1', [uuid]);
      
      if (existingRecord.length === 0) {
        return NextResponse.json({ message: 'Record not found' }, { status: 404 });
      }
    }

    const record = existingRecord[0];
    

    const [existingLead] : any = await db.query('SELECT * FROM leads WHERE user_id = ? AND uuid = ?', [user_id, record.uuid]);
   
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
  const {id, notes} = await req.json();  
  try{         
    await db.query('UPDATE leads SET notes = ? WHERE id = ?', [notes, id]);
    return NextResponse.json({ message: 'Lead updated' });
  }catch(err){
    return NextResponse.json({ message: 'Lead not updated' }, { status: 500 });
  }
}