'use server';

import db from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

export async function getProfile() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) {
      return { success: false, error: 'Usuario no encontrado' };      
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;

    const [rows] = await db.query(
      'SELECT id, name, email, company, event, stand, description, description_en, address, photo, webpage, phone, facebook, instagram, linkedin, x, youtube, tiktok, status FROM users WHERE id = ?',
      [userId]
    );
    const users = rows as any[];

    if (users.length === 0) {
      return { success: false, error: 'Usuario no encontrado' };      
    }

    return users[0];
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return { success: false, error: 'Usuario no encontrado' };
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) {
      return { success: false, error: 'No access token' };
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;

    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const event = formData.get('event') as string;
    const stand = formData.get('stand') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const address = formData.get('address') as string;
    const photo = formData.get('photo') as string;
    const webpage = formData.get('webpage') as string;
    const phone = formData.get('phone') as string;
    const facebook = formData.get('facebook') as string;
    const instagram = formData.get('instagram') as string;
    const linkedin = formData.get('linkedin') as string;
    const x = formData.get('x') as string;
    const youtube = formData.get('youtube') as string;
    const tiktok = formData.get('tiktok') as string;

    if (!name || !company || !event) {
      return { success: false, error: 'name, company y event son requeridos' };
    }

    await db.query(
      'UPDATE users SET name = ?, company = ?, event = ?, stand = ?, description = ?, description_en = ?, address = ?, photo = ?, webpage = ?, phone = ?, facebook = ?, instagram = ?, linkedin = ?, x = ?, youtube = ?, tiktok = ? WHERE id = ?',
      [name, company, event, stand || null, description || null, description_en || null, address || null, photo || null, webpage || null, phone || null, facebook || null, instagram || null, linkedin || null, x || null, youtube || null, tiktok || null, userId]
    );

    revalidatePath('/[locale]/dashboard/profile', 'page');
    return { success: true };
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return { success: false, error: 'Error al actualizar perfil' };
  }
}
