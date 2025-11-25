import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, password, event } = await req.json();

    // Validar campos requeridos
    if (!name || !company || !email || !password || !event) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
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
        { message: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con rol 'exhibitor' por defecto
    await db.query(
      'INSERT INTO users (name, email, password, role, maxsessions, maxexhibitors, event) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [company, email, hashedPassword, 'exhibitor', 1, 1, event]
    );

    // Enviar email de bienvenida
    try {
      await resend.emails.send({
        from: 'IGECO <noreply@igeco.mx>',
        to: email,
        subject: '¡Bienvenido a IGECO! - Tus credenciales de acceso',
        react: EmailTemplate({ name, email, password }),
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // No fallar el registro si el email no se puede enviar
    }

    return NextResponse.json(
      { 
        status: true,
        message: 'Usuario registrado exitosamente. Revisa tu correo para obtener tus credenciales.' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { message: 'Error en el servidor. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
