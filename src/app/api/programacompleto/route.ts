import { NextResponse } from 'next/server';
import db from '@/lib/db';


export async function POST(req: Request) {
    try {
        const { title_esp, title_eng, description_esp, description_eng, duration, time, escenario_id, dia_id } = await req.json();

        // Validación básica
        if (!title_esp || !title_eng || !time || !escenario_id || !dia_id) {
            return NextResponse.json(
                { message: 'Los campos obligatorios son requeridos' },
                { status: 400 }
            );
        }

        // Insertar en la base de datos
        await db.query(
            'INSERT INTO programa (title_esp, title_eng, description_esp, description_eng, duration, time, escenario_id, dia_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title_esp, title_eng, description_esp, description_eng, duration, time, escenario_id, dia_id]
        );

        return NextResponse.json(
            { message: 'Programa agregado exitosamente' },
            { status: 201 }
        );
    } catch (err) {
        console.error('Error al agregar el programa:', err);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
