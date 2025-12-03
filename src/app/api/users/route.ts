import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { isValidEmail, validateStrongPassword, sanitizeString } from '@/lib/validation';

interface DbRow {
  [key: string]: any;
}

interface InsertResult {
  insertId: number;
}

export async function GET() {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, maxsessions, maxexhibitors, company, event, stand FROM users ORDER BY id DESC'
    ) as [DbRow[], any];
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
    const { name, email, password, maxsessions, maxexhibitors, event, company, stand } = await req.json();

    // Validar campos requeridos
    if (!name || !email || !password || !event || !company || !maxexhibitors) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar nombre
    const sanitizedName = sanitizeString(name, 100);
    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json(
        { message: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Validar email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'El formato del email no es válido' },
        { status: 400 }
      );
    }
    
    // Validar contraseña fuerte
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          message: 'La contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as [DbRow[], any];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Este correo electrónico ya está registrado. Por favor, usa otro email.' },
        { status: 409 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, maxsessions, maxexhibitors, event, company, stand, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sanitizedName, email, hashedPassword, 'exhibitor', maxsessions || 0, maxexhibitors || 0, event, company, stand, 1]
    ) as [InsertResult, any];

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
    if (!id || !password) {
      return NextResponse.json(
        { message: 'ID y contraseña son requeridos', status: false },
        { status: 400 }
      );
    }

    // Validar contraseña fuerte
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          message: 'La contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors,
          status: false
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return NextResponse.json({ message: 'Password updated sucess', status: true }, {status: 200});
  }
  catch(err){
    console.error('Error updating password:', err);
    return NextResponse.json({ message: 'Error try later', status: false }, { status: 500 });
  }
 
}
