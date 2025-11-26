import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Extensiones permitidas
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    // Validar la extensión
    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
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
