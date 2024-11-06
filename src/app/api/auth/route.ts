import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();  
  const connection = await mysql.createConnection(db)
  try {    
    const [rows]: any = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    const user = rows[0];
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Contraseña o usuario incorrecto...' }, { status: 401 });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, 'tu_secreto_jwt', { expiresIn: '1h' });

    const response = NextResponse.json({ status: true, message: 'Login exitoso' });
    
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // Expira en 1 hora
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
  finally {
    await connection.end()
  }
}
