import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadDir = path.resolve(process.cwd(), "public", "logos");

async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDir();
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const uuid = formData.get("uuid") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }
    if (!uuid) {
      return NextResponse.json({ error: "UUID es requerido" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `El archivo es demasiado grande. Tamaño máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }, { status: 400 });
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({
        error: "Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG y WebP",
      }, { status: 400 });
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json({ error: "Extensión de archivo no válida" }, { status: 400 });
    }

    const uniqueName = `${uuid}${extension}`;
    const filePath = path.join(uploadDir, uniqueName);
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    return NextResponse.json({ path: uniqueName }, { status: 200 });
  } catch (error) {
    console.error("Upload logo error:", error);
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }
}
