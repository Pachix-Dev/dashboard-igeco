import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { email, password } = await req.json();

    // Check if user exists
    const [rows] : any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 401 }
      );
    }
    const user = rows[0];
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Contraseña o usuario incorrecto.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, maxsessions: user.maxsessions },
      process.env.JWT_SECRET || 'tu_secreto_jwt', // Use an environment variable for the secret
      { expiresIn: '7d' }
    );

    
    // Check if the token already exists in the database
    const [existingSession] : any = await db.query(
      'SELECT * FROM user_sessions WHERE session_token = ?',
      [token]
    );

    // Register new session if it doesn't exist
    if (existingSession.length === 0) {
      await db.query(
        'INSERT INTO user_sessions (user_id, session_token) VALUES (?, ?)',
        [user.id, token]
      );
    }

    // Prepare successful response
    const response = NextResponse.json(
      {
        status: true,
        message: 'Login exitoso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for the token
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: 'Error en el servidor. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
