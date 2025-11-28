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
    console.log('📤 Iniciando upload...');
    await ensureUploadDir(); // Crear carpeta si no existe

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const uuid = formData.get("uuid") as string | null;

    console.log('📋 Datos recibidos:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      uuid: uuid
    });

    if (!file) {
      console.error('❌ No se recibió archivo');
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    if (!uuid) {
      console.error('❌ No se recibió UUID');
      return NextResponse.json({ error: "UUID es requerido" }, { status: 400 });
    }

    // Validar el tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      console.error('❌ Archivo demasiado grande:', file.size);
      return NextResponse.json({ 
        error: `El archivo es demasiado grande. Tamaño máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Validar el tipo MIME del archivo (más flexible)
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      console.warn('⚠️ Tipo MIME no reconocido:', file.type, '- Validando por extensión...');
    }

    // Validar la extensión
    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      console.error('❌ Extensión no válida:', extension);
      return NextResponse.json({ 
        error: `Extensión de archivo no válida. Solo se permiten: ${allowedExtensions.join(', ')}` 
      }, { status: 400 });
    }

    // Usar el UUID proporcionado para el nombre del archivo
    const uniqueName = `${uuid}${extension}`;
    const filePath = path.join(uploadDir, uniqueName);

    console.log('💾 Guardando archivo en:', filePath);

    // Guardar la imagen en public/ponentes
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    console.log('✅ Archivo guardado exitosamente:', uniqueName);

    // Solo devolver el nombre del archivo, la ruta se agrega en el frontend
    return NextResponse.json({ 
      path: uniqueName,
      size: file.size,
      type: file.type || 'unknown'
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json({ 
      error: "Error al subir la imagen",
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
