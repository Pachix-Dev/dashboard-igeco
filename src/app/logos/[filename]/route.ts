import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const uploadDir = path.resolve(process.cwd(), 'public', 'logos');

// Forzar que sea dinámico y sin caché de datos en el servidor
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  // Evita path traversal y normaliza el nombre
  const safeName = path.basename(params.filename);
  const filePath = path.join(uploadDir, safeName);

  try {
    const data = await fs.readFile(filePath);
    // Convertir a Uint8Array para que encaje con BodyInit tipado
    const fileData = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    const type = getMimeType(safeName);

    return new NextResponse(fileData as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}
