import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validateStrongPassword } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token y contraseña son requeridos' },
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

    // Verificar token
    const [resets]: any = await db.query(
      'SELECT user_id, expires_at FROM password_resets WHERE token = ?',
      [token]
    );

    if (resets.length === 0) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 400 }
      );
    }

    const reset = resets[0];

    // Verificar si el token ha expirado
    if (new Date() > new Date(reset.expires_at)) {
      await db.query('DELETE FROM password_resets WHERE token = ?', [token]);
      return NextResponse.json(
        { message: 'El token ha expirado' },
        { status: 400 }
      );
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña del usuario
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, reset.user_id]
    );

    // Eliminar token usado
    await db.query('DELETE FROM password_resets WHERE token = ?', [token]);

    return NextResponse.json(
      { 
        status: true,
        message: 'Contraseña actualizada exitosamente' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during password reset:', error);
    return NextResponse.json(
      { message: 'Error en el servidor. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
