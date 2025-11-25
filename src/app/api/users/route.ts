import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const [users]: any = await db.query(
      'SELECT id, name, email, role, maxsessions, maxexhibitors, event FROM users ORDER BY id DESC'
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, maxsessions, maxexhibitors, event } = await req.json();

    // Validar campos requeridos
    if (!name || !email || !password || !role || !event) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
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

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const [existingUsers]: any = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Este correo electrónico ya está registrado. Por favor, usa otro email.' },
        { status: 409 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const [result]: any = await db.query(
      'INSERT INTO users (name, email, password, role, maxsessions, maxexhibitors, event) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, maxsessions || 1, maxexhibitors || 1, event]
    );

    return NextResponse.json(
      { 
        message: 'Usuario creado exitosamente',
        id: result.insertId
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating user:', err);
    
    // Error de MySQL para clave duplicada (por si acaso)
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'Este correo electrónico ya está registrado.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error al crear el usuario. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { id, password } = await req.json();  
  try{
    const hashedPassword = await bcrypt.hash(password, 10);    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return NextResponse.json({ message: 'Password updated sucess', status: true }, {status: 200});
  }
  catch(err){
    return NextResponse.json({ message: 'Error try later', status: false }, { status: 500 });
  }
 
}
