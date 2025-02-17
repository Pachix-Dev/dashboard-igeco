import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
  const {user_id, name, lastname, email, position, nationality} = await req.json();  
  try{         
    await db.query('INSERT INTO exhibitors (user_id, name, lastname, email, position, nationality) VALUES (?, ?, ?, ?, ?, ?)', [user_id, name, lastname , email, position, nationality]);
    return NextResponse.json({ message: 'Exhibitor created' }, { status: 201 });
  }catch(err){
    return NextResponse.json({ message: 'Exhibitor not created' }, { status: 500 });
  }
}
//AGREGARE AQUI EL DE BUSCAR 
export async function GET(req: Request) {
  try {
    const { search } = await req.json();  
    const results = await db.query(
      "SELECT * FROM exhibitors WHERE name LIKE ? OR lastname LIKE ? OR email LIKE ?",
      [`%${search}%`, `%${search}%`, `%${search}%`] //buca por medio de esto 
    );
    return NextResponse.json(results);  // Retorna los resultados de la búsqueda 
  } catch (err) {
    console.error("Error en la búsqueda:", err);
    return NextResponse.json({ message: 'Error en la búsqueda' }, { status: 500 });
  }
}



