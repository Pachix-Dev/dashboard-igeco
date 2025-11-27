import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Extensiones permitidas
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

// Tipos MIME permitidos
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

// Tamaño máximo: 5MB (en bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Directorio donde se guardarán las imágenes
const uploadDir = path.join(process.cwd(), "public/ponentes");

// Asegurar que el directorio existe
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDir(); // Crear carpeta si no existe

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const uuid = formData.get("uuid") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    if (!uuid) {
      return NextResponse.json({ error: "UUID es requerido" }, { status: 400 });
    }

    // Validar el tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `El archivo es demasiado grande. Tamaño máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Validar el tipo MIME del archivo
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG y WebP" 
      }, { status: 400 });
    }

    // Validar la extensión
    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json({ 
        error: "Extensión de archivo no válida" 
      }, { status: 400 });
    }

    // Usar el UUID proporcionado para el nombre del archivo
    const uniqueName = `${uuid}${extension}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Guardar la imagen en public/Ponentes
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // Solo devolver el nombre del archivo, la ruta se agrega en el frontend
    return NextResponse.json({ path: uniqueName }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
