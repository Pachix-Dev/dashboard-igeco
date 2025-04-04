import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const {name_esp, name_eng} = await req.json();

        await db.query(
            'INSERT INTO dias (name_esp, name_eng) VALUES (?, ?)',
            [name_esp, name_eng]
        );

        return NextResponse.json({ message: 'Dias creados' }, { status: 201 });
    } catch (err) {
        console.error('Error al crear el dia:', err);
        return NextResponse.json({ message: 'Error al crear el día' }, { status: 500 });
    }
}
