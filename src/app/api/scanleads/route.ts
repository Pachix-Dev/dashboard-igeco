import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const {uuid, user_id} = await req.json();  
  try{         
    const [existingRecord] : any = await db.query('SELECT * FROM records WHERE  uuid = ?', [uuid]);
    
    if (existingRecord.length === 0) {
     return NextResponse.json({ message: 'Record not found' }, { status: 404 });    
    }

    const record = existingRecord[0];
    
    const [existingLead] : any = await db.query('SELECT * FROM leads WHERE user_id = ? AND record_id = ?', [user_id, record.id]);
   
    if(existingLead.length > 0){
      return NextResponse.json({ message: 'Lead already exists' }, { status: 400 });
    }

    await db.query('INSERT INTO leads (record_id, user_id) VALUES (?, ?)', [record.id, user_id]);
    return NextResponse.json({ message: 'Lead created' }, { status: 201 });
  }catch(err){
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