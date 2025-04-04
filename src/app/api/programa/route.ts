import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const { name} = await req.json();

        await db.query(
            'INSERT INTO escenarios (name) VALUES (?)',
            [name]
        );

        return NextResponse.json({ message: 'Escenario creado' }, { status: 201 });
    } catch (err) {
        console.error('Error al crear el escenario:', err);
        return NextResponse.json({ message: 'Error al crear el escenario' }, { status: 500 });
    }
}
