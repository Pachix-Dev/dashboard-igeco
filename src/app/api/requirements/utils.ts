import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { resolveActorFromToken, type RequirementsActor } from '@/lib/requirements-service';

export async function resolveApiActor(req: NextRequest): Promise<RequirementsActor | null> {
  const token = req.cookies.get('access_token')?.value;
  return resolveActorFromToken(token);
}

export function parseTargetUserId(req: NextRequest, payload: any): number | undefined {
  const fromQuery = req.nextUrl.searchParams.get('userId');
  const fromBody = payload?.targetUserId ?? payload?.userId;
  const value = fromBody ?? fromQuery;
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function saveRequirementsFile(userId: number, file: File): Promise<{
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  fileMime: string;
  fileFingerprint: string;
}> {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const relativeDir = path.join('requirements', String(userId));
  const absoluteDir = path.resolve(process.cwd(), 'public', relativeDir);
  const absolutePath = path.join(absoluteDir, safeName);

  await fs.mkdir(absoluteDir, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await fs.writeFile(absolutePath, bytes);

  const relativePath = path.join(relativeDir, safeName).replace(/\\/g, '/');
  // Generar URL que use la ruta dinámicade Next.js
  const fileUrl = `/requirements/${userId}/${safeName}`;

  return {
    fileName: file.name,
    filePath: relativePath,
    fileUrl: fileUrl,
    fileSize: file.size,
    fileMime: file.type,
    fileFingerprint: `${file.name}::${file.size}::${file.lastModified}`
  };
}

export function toErrorResponse(error: unknown, fallback = 'Error interno del servidor') {
  const message = error instanceof Error ? error.message : fallback;
  const isAuth = /No autenticado|No autorizado|Solo administrador/.test(message);
  const isValidation =
    /no valido|obligatorio|limite|maximo|confirmacion|No puedes|duplicados|no encontrado|permitido/.test(message);

  const status = isAuth ? 403 : isValidation ? 400 : 500;
  return NextResponse.json({ success: false, message }, { status });
}
