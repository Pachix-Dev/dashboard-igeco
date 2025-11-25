import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const [users]: any = await db.query(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Por seguridad, no revelar si el email existe o no
      return NextResponse.json(
        { 
          status: true,
          message: 'Si el email existe, recibirás un enlace de recuperación' 
        },
        { status: 200 }
      );
    }

    const user = users[0];

    // Generar token único
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await db.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?',
      [user.id, resetToken, expiresAt, resetToken, expiresAt]
    );

    // Enviar email con el enlace de recuperación
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    try {
      await resend.emails.send({
        from: 'IGECO <noreply@igeco.mx>',
        to: [email],
        subject: 'Recuperación de contraseña - IGECO',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Recuperación de contraseña</h2>
            <p>Hola ${user.name},</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Restablecer contraseña
            </a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este email.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              IGECO - Industrial Green Economy<br>
              Blvrd Francisco Villa 102-piso 14, Oriental, 37510 León, Guanajuato, México
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { message: 'Error al enviar el email de recuperación' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        status: true,
        message: 'Si el email existe, recibirás un enlace de recuperación' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during password reset request:', error);
    return NextResponse.json(
      { message: 'Error en el servidor. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
