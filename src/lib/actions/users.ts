"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "@/lib/db";
import { EmailTemplate } from "@/components/email-template";
import {
  isValidEmail,
  sanitizeString,
  validateStrongPassword,
} from "@/lib/validation";

export type DashboardUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  maxexhibitors: number;
  event: string;
  company: string;
  stand: string | null;
  status: number;
  show_directory: number;
  photo: string | null;
};

type Locale = "es" | "en" | "it" | (string & {});

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  emailStatus?: {
    success: boolean;
    message: string;
  };
};

type CreateUserInput = {
  name: string;
  company: string;
  email: string;
  password: string;
  role?: string;
  maxexhibitors: number | string;
  event: string;
  stand: string;
  show_directory?: number;
  description?: string | null;
  description_en?: string | null;
  address?: string | null;
  photo?: string | null;
  webpage?: string | null;
  phone?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  x?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  locale: Locale;
};

type UpdateUserInput = {
  id: number;
  name: string;
  email: string;
  company: string;
  event: string;
  stand: string;
  maxexhibitors?: number | string;
  show_directory?: number;
  status?: number;
  description?: string | null;
  description_en?: string | null;
  address?: string | null;
  photo?: string | null;
  webpage?: string | null;
  phone?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  x?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  locale: Locale;
};

type UpdatePasswordInput = {
  id: number;
  name: string;
  email: string;
  password: string;
  locale: Locale;
};

const subjectsByLocale: Record<"es" | "en" | "it", string> = {
  es: "¡Bienvenido a IGECO! - Tus credenciales de acceso",
  en: "Welcome to IGECO! - Your access credentials",
  it: "Benvenuto in IGECO! - Le tue credenziali di accesso",
};

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const safeLocale = (locale: Locale): "es" | "en" | "it" => {
  if (locale === "en") {
    return "en";
  }

  if (locale === "it") {
    return "it";
  }

  return "es";
};

const localeDashboardPath = (locale: Locale) =>
  `/${safeLocale(locale)}/dashboard/usuarios`;

const mapRowToDashboardUser = (row: RowDataPacket): DashboardUser => ({
  id: Number(row.id),
  name: String(row.name ?? ""),
  email: String(row.email ?? ""),
  role: String(row.role ?? ""),
  maxexhibitors: Number(row.maxexhibitors ?? 0),
  event: String(row.event ?? ""),
  company: String(row.company ?? ""),
  stand: row.stand !== undefined && row.stand !== null ? String(row.stand) : null,
  status: Number(row.status ?? 1),
  show_directory: Number(row.show_directory ?? 0),
  photo: row.photo !== undefined && row.photo !== null ? String(row.photo) : null,
});

async function sendCredentialsEmail({
  name,
  email,
  password,
  locale,
}: {
  name: string;
  email: string;
  password: string;
  locale: Locale;
}): Promise<{ success: boolean; message: string }> {
  if (!resendClient) {
    return {
      success: false,
      message: "Servicio de email no configurado",
    };
  }

  try {
    const localeKey = safeLocale(locale);
    const { error } = await resendClient.emails.send({
      from: "IGECO <noreply@igeco.mx>",
      to: email,
      subject: subjectsByLocale[localeKey],
      react: EmailTemplate({
        name,
        email,
        password,
        locale: localeKey,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        message: "No pudimos enviar el email de bienvenida",
      };
    }

    return {
      success: true,
      message: "Email de bienvenida enviado exitosamente",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "No pudimos enviar el email de bienvenida",
    };
  }
}

export async function getDashboardUsers(): Promise<DashboardUser[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, email, role, maxexhibitors, event, company, stand, description, description_en, address, photo, webpage, phone, facebook, instagram, linkedin, x, youtube, tiktok, status, show_directory FROM users WHERE role != 'admin' ORDER BY id DESC"
    );

    return rows.map(mapRowToDashboardUser);
  } catch (error) {
    console.error("Error loading dashboard users:", error);
    return [];
  }
}

export async function createUserAction(
  input: CreateUserInput
): Promise<ActionResult<DashboardUser>> {
  const {
    name,
    company,
    email,
    password,
    maxexhibitors,
    event,
    stand,
    show_directory,
    description,
    description_en,
    address,
    photo,
    webpage,
    phone,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
    tiktok,
    locale,
  } = input;

  try {
    if (
      !name ||
      !email ||
      !password ||
      !event ||
      !company ||
      !stand ||
      maxexhibitors === undefined
    ) {
      return {
        success: false,
        message: "Todos los campos obligatorios son requeridos",
      };
    }

    const sanitizedName = sanitizeString(name, 100);
    if (!sanitizedName || sanitizedName.length < 2) {
      return {
        success: false,
        message: "El nombre debe tener al menos 2 caracteres",
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        message: "El formato del email no es válido",
      };
    }

    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        message: "La contraseña no cumple con los requisitos de seguridad",
        errors: passwordValidation.errors,
      };
    }

    const [existingUsers] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return {
        success: false,
        message:
          "Este correo electrónico ya está registrado. Por favor, usa otro email.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedMaxExhibitors = Number(maxexhibitors ?? 0) || 0;
    const normalizedShowDirectory = Number(show_directory ?? 0);

    const sanitizedCompany = sanitizeString(company, 150);
    const sanitizedStand = sanitizeString(stand, 150);
    const sanitizedDescription = description ? sanitizeString(description, 1000) : null;
    const sanitizedDescriptionEn = description_en ? sanitizeString(description_en, 1000) : null;
    const sanitizedAddress = address ? sanitizeString(address, 200) : null;
    const sanitizedWebpage = webpage ? sanitizeString(webpage, 200) : null;
    const sanitizedPhone = phone ? sanitizeString(phone, 50) : null;
    const sanitizedFacebook = facebook ? sanitizeString(facebook, 200) : null;
    const sanitizedInstagram = instagram ? sanitizeString(instagram, 200) : null;
    const sanitizedLinkedin = linkedin ? sanitizeString(linkedin, 200) : null;
    const sanitizedX = x ? sanitizeString(x, 200) : null;
    const sanitizedYoutube = youtube ? sanitizeString(youtube, 200) : null;
    const sanitizedTiktok = tiktok ? sanitizeString(tiktok, 200) : null;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO users (
        name, email, password, role, maxexhibitors, event, company, stand, 
        status, show_directory, description, description_en, address, photo, webpage, 
        phone, facebook, instagram, linkedin, x, youtube, tiktok
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizedName,
        email,
        hashedPassword,
        input.role ?? "exhibitor",
        normalizedMaxExhibitors,
        event,
        sanitizedCompany,
        sanitizedStand,
        1, // status
        normalizedShowDirectory,
        sanitizedDescription,
        sanitizedDescriptionEn,
        sanitizedAddress,
        photo || null,
        sanitizedWebpage,
        sanitizedPhone,
        sanitizedFacebook,
        sanitizedInstagram,
        sanitizedLinkedin,
        sanitizedX,
        sanitizedYoutube,
        sanitizedTiktok,
      ]
    );

    const [createdRows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, email, role, maxexhibitors, event, company, stand FROM users WHERE id = ?",
      [result.insertId]
    );

    const createdUser = createdRows.length
      ? mapRowToDashboardUser(createdRows[0])
      : {
          id: Number(result.insertId),
          name: sanitizedName,
          email,
          role: input.role ?? "exhibitor",
          maxexhibitors: normalizedMaxExhibitors,
          event,
          company: sanitizedCompany,
          stand: sanitizedStand,
          status: 1,
          show_directory: normalizedShowDirectory,
          photo: photo || null,
        };

    const emailStatus = await sendCredentialsEmail({
      name: sanitizedName,
      email,
      password,
      locale,
    });

    revalidatePath(localeDashboardPath(locale));

    return {
      success: true,
      message: "Usuario creado exitosamente",
      data: createdUser,
      emailStatus,
    };
  } catch (error: any) {
    console.error("Error creating user via action:", error);

    if (error?.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        message: "Este correo electrónico ya está registrado.",
      };
    }

    return {
      success: false,
      message: "Error al crear el usuario. Por favor, intenta nuevamente.",
    };
  }
}

export async function updateUserAction(
  input: UpdateUserInput
): Promise<ActionResult<DashboardUser>> {
  const {
    id,
    name,
    email,
    company,
    event,
    stand,
    maxexhibitors,
    show_directory,
    status,
    description,
    description_en,
    address,
    photo,
    webpage,
    phone,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
    tiktok,
    locale,
  } = input;

  try {
    if (!id || !name || !email || !event || !company) {
      return {
        success: false,
        message: "Todos los campos son requeridos",
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        message: "El formato del email no es válido",
      };
    }

    const [existingUser] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    const [emailCheck] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (emailCheck.length > 0) {
      return {
        success: false,
        message: "Este correo electrónico ya está siendo usado por otro usuario.",
      };
    }

    const normalizedMaxExhibitors = Number(maxexhibitors ?? 0) || 0;
    const normalizedShowDirectory = Number(show_directory ?? 0);
    const normalizedStatus = Number(status ?? 1);

    const sanitizedName = sanitizeString(name, 100);
    const sanitizedCompany = sanitizeString(company, 150);
    const sanitizedStand = sanitizeString(stand, 150);
    const sanitizedDescription = description ? sanitizeString(description, 1000) : null;
    const sanitizedDescriptionEn = description_en ? sanitizeString(description_en, 1000) : null;
    const sanitizedAddress = address ? sanitizeString(address, 200) : null;
    const sanitizedWebpage = webpage ? sanitizeString(webpage, 200) : null;
    const sanitizedPhone = phone ? sanitizeString(phone, 50) : null;
    const sanitizedFacebook = facebook ? sanitizeString(facebook, 200) : null;
    const sanitizedInstagram = instagram ? sanitizeString(instagram, 200) : null;
    const sanitizedLinkedin = linkedin ? sanitizeString(linkedin, 200) : null;
    const sanitizedX = x ? sanitizeString(x, 200) : null;
    const sanitizedYoutube = youtube ? sanitizeString(youtube, 200) : null;
    const sanitizedTiktok = tiktok ? sanitizeString(tiktok, 200) : null;

    await db.query(
      `UPDATE users SET 
        name = ?, email = ?, maxexhibitors = ?, event = ?, company = ?, stand = ?,
        show_directory = ?, status = ?, description = ?, description_en = ?, address = ?, photo = ?,
        webpage = ?, phone = ?, facebook = ?, instagram = ?, linkedin = ?, x = ?, youtube = ?, tiktok = ?
      WHERE id = ?`,
      [
        sanitizedName,
        email,
        normalizedMaxExhibitors,
        event,
        sanitizedCompany,
        sanitizedStand,
        normalizedShowDirectory,
        normalizedStatus,
        sanitizedDescription,
        sanitizedDescriptionEn,
        sanitizedAddress,
        photo || null,
        sanitizedWebpage,
        sanitizedPhone,
        sanitizedFacebook,
        sanitizedInstagram,
        sanitizedLinkedin,
        sanitizedX,
        sanitizedYoutube,
        sanitizedTiktok,
        id,
      ]
    );

    const [updatedRows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, email, role, maxexhibitors, event, company, stand FROM users WHERE id = ?",
      [id]
    );

    const updatedUser = updatedRows.length
      ? mapRowToDashboardUser(updatedRows[0])
      : {
          id,
          name: sanitizedName,
          email,
          role: "exhibitor",
          maxexhibitors: normalizedMaxExhibitors,
          event,
          company: sanitizedCompany,
          stand: sanitizedStand,
          status: 1,
          show_directory: normalizedShowDirectory,
          photo: photo || null,
        };

    revalidatePath(localeDashboardPath(locale));

    return {
      success: true,
      message: "Usuario actualizado exitosamente",
      data: updatedUser,
    };
  } catch (error: any) {
    console.error("Error updating user via action:", error);

    if (error?.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        message: "Este correo electrónico ya está registrado.",
      };
    }

    return {
      success: false,
      message: "Error al actualizar el usuario. Por favor, intenta nuevamente.",
    };
  }
}

export async function updatePasswordAction(
  input: UpdatePasswordInput
): Promise<ActionResult> {
  const { id, name, email, password, locale } = input;

  try {
    if (!id || !password) {
      return {
        success: false,
        message: "ID y contraseña son requeridos",
      };
    }

    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        message: "La contraseña no cumple con los requisitos de seguridad",
        errors: passwordValidation.errors,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);

    const emailStatus = await sendCredentialsEmail({
      name,
      email,
      password,
      locale,
    });

    revalidatePath(localeDashboardPath(locale));

    return {
      success: true,
      message: "Contraseña actualizada correctamente",
      emailStatus,
    };
  } catch (error) {
    console.error("Error updating password via action:", error);
    return {
      success: false,
      message:
        "Error al actualizar la contraseña. Por favor, intenta nuevamente.",
    };
  }
}
