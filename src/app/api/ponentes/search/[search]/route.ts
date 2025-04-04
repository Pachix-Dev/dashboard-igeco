import { NextResponse } from 'next/server';
import db from 'app/lib/db';

export async function GET(req: Request, { params }: { params: { search: string } }) {
  try {
    const search = params.search;  // Accedemos al valor de 'search' desde la URL
    // Esta es la consulta de la base de datos 
    const [results] = await db.query(
      "SELECT * FROM ponentes WHERE name LIKE ? OR company LIKE ? ",
      [`%${search}%`, `%${search}%`, ] // buscamos por los 3 valores 
    );
    // esto es para retornar en json con los valores que nos da 
    return NextResponse.json(results);  
  } catch (err) {
    console.error("Error en la búsqueda:", err);
    return NextResponse.json({ message: 'Error en la búsqueda' }, { status: 500 });
  }
}
