import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const { escenario_id, dia_id } = await req.json();

        // Validar que los datos existen
        if (!escenario_id || !dia_id) {
            return NextResponse.json(
                { message: 'Escenario y Día son requeridos' },
                { status: 400 }
            );
        }

        // Insertar la relación en la base de datos
        await db.query(
            'INSERT INTO escenario_dias (escenario_id, dia_id) VALUES (?, ?)',
            [escenario_id, dia_id]
        );

        return NextResponse.json(
            { message: 'Relación creada exitosamente' },
            { status: 201 }
        );
    } catch (err) {
        console.error('Error al crear la relación:', err);
        return NextResponse.json(
            { message: 'Error al crear la relación' },
            { status: 500 }
        );
    }
}
