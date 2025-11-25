import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(req: Request, { params }: { params: { id: number } }) {
  try {
    const [user]: any = await db.query('SELECT * FROM users WHERE id = ?', [params.id]);
    
    if (!user || user.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Error al obtener el usuario' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  try {
    const { name, email, role, maxsessions, event } = await req.json();

    // Validar campos requeridos
    if (!name || !email || !role || !event) {
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

    // Verificar si el usuario existe
    const [existingUser]: any = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [params.id]
    );

    if (!existingUser || existingUser.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el email ya existe en otro usuario
    const [emailCheck]: any = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, params.id]
    );

    if (emailCheck.length > 0) {
      return NextResponse.json(
        { message: 'Este correo electrónico ya está siendo usado por otro usuario.' },
        { status: 409 }
      );
    }

    // Actualizar usuario
    await db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, maxsessions = ?, event = ? WHERE id = ?',
      [name, email, role, maxsessions || 1, event, params.id]
    );

    return NextResponse.json({ message: 'Usuario actualizado exitosamente' });
  } catch (err: any) {
    console.error('Error updating user:', err);

    // Error de MySQL para clave duplicada
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'Este correo electrónico ya está registrado.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error al actualizar el usuario. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: number } }) {
  try {
    // Verificar si el usuario existe
    const [existingUser]: any = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [params.id]
    );

    if (!existingUser || existingUser.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar usuario
    await db.query('DELETE FROM users WHERE id = ?', [params.id]);

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error al eliminar el usuario. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
