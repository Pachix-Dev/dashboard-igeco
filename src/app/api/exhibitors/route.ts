import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const { user_id, name, lastname, email, position, nationality } = await req.json();

    // Validar campos requeridos
    if (!user_id || !name || !lastname || !email) {
      return NextResponse.json(
        { message: 'Los campos nombre, apellido y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe para este usuario
    const [existingExhibitor]: any = await db.query(
      'SELECT id FROM exhibitors WHERE email = ? AND user_id = ?',
      [email, user_id]
    );

    if (existingExhibitor.length > 0) {
      return NextResponse.json(
        { message: 'Ya tienes un expositor registrado con este correo electrónico.' },
        { status: 409 }
      );
    }

    const uuid = uuidv4(); // Generar UUID único
    const [result]: any = await db.query(
      'INSERT INTO exhibitors (user_id, name, lastname, email, position, nationality, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, name, lastname, email, position, nationality, uuid]
    );

    // Retornar el exhibitor creado con su ID
    const newExhibitor = {
      id: result.insertId,
      user_id,
      name,
      lastname,
      email,
      position,
      nationality,
      uuid,
      impresiones: 0,
    };

    return NextResponse.json(newExhibitor, { status: 201 });
  } catch (err: any) {
    console.error('Error creating exhibitor:', err);

    // Error de MySQL para clave duplicada
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'Este correo electrónico ya está registrado.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error al crear el expositor. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}



