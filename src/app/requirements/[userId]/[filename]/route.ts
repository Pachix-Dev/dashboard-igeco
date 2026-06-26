import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const uploadsDir = path.resolve(process.cwd(), 'public', 'requirements');

// Forzar que sea dinámico y sin caché
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export async function GET(
  _req: Request,
  { params }: { params: { userId: string; filename: string } }
) {
  try {
    // Evita path traversal y normaliza el nombre
    const userId = path.basename(params.userId);
    const filename = path.basename(params.filename);
    const filePath = path.join(uploadsDir, userId, filename);

    // Verificar que el archivo está dentro del directorio permitido
    const resolvedPath = path.resolve(filePath);
    const resolvedDir = path.resolve(uploadsDir);
    if (!resolvedPath.startsWith(resolvedDir)) {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }

    const data = await fs.readFile(filePath);
    const fileData = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    const type = getMimeType(filename);

    return new NextResponse(fileData as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json({ message: 'Archivo no encontrado' }, { status: 404 });
  }
}
