import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../lib/db';
import { isValidEmail, sanitizeString } from '../../../lib/validation';

interface ExhibitorData {
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  position?: string;
  company?: string;
}

export async function POST(req: Request) {
  try {
    const { user_id, name, lastname, email, position, company } = await req.json() as ExhibitorData;

    // Validar campos requeridos
    if (!user_id || !name || !lastname || !email) {
      return NextResponse.json(
        { message: 'Los campos nombre, apellido y email son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedLastname = sanitizeString(lastname, 100);
    const sanitizedPosition = position ? sanitizeString(position, 100) : null;
    const sanitizedCompany = company ? sanitizeString(company, 200) : null;

    // Validar formato de email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Obtener información del usuario y verificar límite de expositores
    const [users]: any = await db.query(
      'SELECT maxexhibitors FROM users WHERE id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const maxExhibitors = users[0].maxexhibitors;

    // Verificar si el usuario tiene permiso para agregar expositores
    if (maxExhibitors === 0) {
      return NextResponse.json(
        { message: 'No tienes permiso para agregar expositores. Contacta al administrador para activar esta funcionalidad.' },
        { status: 403 }
      );
    }

    // Contar cuántos expositores tiene actualmente el usuario
    const [countResult]: any = await db.query(
      'SELECT COUNT(*) as total FROM exhibitors WHERE user_id = ?',
      [user_id]
    );

    const currentTotal = countResult[0].total;

    // Verificar si ya alcanzó el límite permitido
    if (currentTotal >= maxExhibitors) {
      return NextResponse.json(
        { message: `Has alcanzado el límite de expositores permitidos (${currentTotal}/${maxExhibitors}). Contacta al administrador para aumentar tu límite.` },
        { status: 403 }
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
    
    interface InsertResult {
      insertId: number;
    }
    
    const [result] = await db.query(
      'INSERT INTO exhibitors (user_id, name, lastname, email, position, company, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, sanitizedName, sanitizedLastname, email, sanitizedPosition, sanitizedCompany, uuid]
    ) as [InsertResult, any];

    // Retornar el exhibitor creado con su ID
    const newExhibitor = {
      id: result.insertId,
      user_id,
      name,
      lastname,
      email,
      position,
      company,
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



