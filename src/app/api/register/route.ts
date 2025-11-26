import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/email-template';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../lib/rate-limiter';
import { isValidEmail, validateStrongPassword, sanitizeString } from '../../../lib/validation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.REGISTER);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          message: 'Demasiados intentos de registro. Por favor, intenta más tarde.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString()
          }
        }
      );
    }

    const { name, company, email, password, event, locale = 'es' } = await req.json();

    // Validar campos requeridos
    if (!name || !company || !email || !password || !event) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedCompany = sanitizeString(company, 100);

    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json(
        { message: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (!sanitizedCompany || sanitizedCompany.length < 2) {
      return NextResponse.json(
        { message: 'El nombre de la empresa debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Validar email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
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
      [sanitizedCompany, email, hashedPassword, 'exhibitor', 0, 0, event]
    );

    // Enviar email de bienvenida
    try {
      const subjects = {
        es: '¡Bienvenido a IGECO! - Tus credenciales de acceso',
        en: 'Welcome to IGECO! - Your access credentials',
        it: 'Benvenuto in IGECO! - Le tue credenziali di accesso',
      };
      
      await resend.emails.send({
        from: 'IGECO <noreply@igeco.mx>',
        to: email,
        subject: subjects[locale as 'es' | 'en' | 'it'] || subjects.es,
        react: EmailTemplate({ name, email, password, locale: locale as 'es' | 'en' | 'it' }),
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
