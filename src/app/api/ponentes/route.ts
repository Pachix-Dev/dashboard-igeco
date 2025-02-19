import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const { name, lastname, companny, categoria, escenario, email, event} = await req.json();  
  try{         
    await db.query('INSERT INTO ponentes (name, lastname, companny, categoria, escenario, email, event) VALUES ( ?, ?, ?, ?, ?, ?, ?)', [ name, lastname , companny, categoria, escenario, email, event]);
    return NextResponse.json({ message: 'Ponente created' }, { status: 201 });
  }catch(err){
    return NextResponse.json({ message: 'Ponente not created' }, { status: 500 });
  }
}



