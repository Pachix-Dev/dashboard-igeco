import { NextResponse } from 'next/server';
import db from 'app/lib/db';

export async function POST(req: Request) {
  const { uuid, photo } = await req.json();

  try {
    await db.query(
      'UPDATE ponentes SET photo = ? WHERE uuid = ?',
      [photo, uuid]
    );

    return NextResponse.json({ message: 'Photo updated' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Photo update failed' }, { status: 500 });
  }
}
