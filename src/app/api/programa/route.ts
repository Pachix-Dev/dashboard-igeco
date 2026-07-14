import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { name, feria } = await req.json();

        if (!name || !feria) {
            return NextResponse.json({ message: 'Nombre y feria son requeridos' }, { status: 400 });
        }

        await db.query(
            'INSERT INTO escenarios (name, feria) VALUES (?, ?)',
            [name, feria]
        );

        return NextResponse.json({ message: 'Escenario creado' }, { status: 201 });
    } catch (err) {
        console.error('Error al crear el escenario:', err);
        return NextResponse.json({ message: 'Error al crear el escenario' }, { status: 500 });
    }
}
