'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import db, { db_re_eco } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Exhibitor } from '@/lib/definitions';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

interface SessionData {
  id: number;
  email: string;
  role: string;
  status: number;
  maxexhibitors: number;
  scanleads_purchased: number;
}

interface DashboardSessionData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: number;
  event: string | null;
  company: string | null;
  stand: string | null;
  description: string | null;
  description_en: string | null;
  phone: string | null;
  address: string | null;
  photo: string | null;
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const token = cookies().get('access_token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };

    // Obtener datos adicionales del usuario
    const [rows] = await db.query<any[]>(
      'SELECT id, email, role, status, maxexhibitors, scanleads_purchased FROM users WHERE id = ?',
      [payload.id]
    );

    if (!rows || rows.length === 0) return null;

    return {
      id: rows[0].id,
      email: rows[0].email,
      role: rows[0].role,
      status: rows[0].status,
      maxexhibitors: rows[0].maxexhibitors || 0,
      scanleads_purchased: rows[0].scanleads_purchased || 0,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getDashboardSession(): Promise<DashboardSessionData | null> {
  try {
    const token = cookies().get('access_token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };

    // Obtener datos completos del usuario para el dashboard
    const [rows] = await db.query<any[]>(
      'SELECT id, name, email, role, status, event, company, stand, description, description_en, phone, address, photo FROM users WHERE id = ?',
      [payload.id]
    );

    if (!rows || rows.length === 0) return null;

    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
      status: rows[0].status,
      event: rows[0].event,
      company: rows[0].company,
      stand: rows[0].stand,
      description: rows[0].description,
      description_en: rows[0].description_en,
      phone: rows[0].phone,
      address: rows[0].address,
      photo: rows[0].photo,
    };
  } catch (error) {
    console.error('Error getting dashboard session:', error);
    return null;
  }
}

export async function getExhibitorStats(userId: number) {
  try {
    const [rows] = await db.query<any[]>(
      'SELECT COUNT(*) as total FROM exhibitors WHERE user_id = ?',
      [userId]
    );

    const [userRows] = await db.query<any[]>(
      'SELECT maxexhibitors FROM users WHERE id = ?',
      [userId]
    );

    const total = rows[0]?.total || 0;
    const maxExhibitors = userRows[0]?.maxexhibitors || 0;
    const remaining = Math.max(0, maxExhibitors - total);
    const usagePercentage = maxExhibitors > 0 ? (total / maxExhibitors) * 100 : 0;

    return {
      total,
      maxExhibitors,
      remaining,
      usagePercentage,
    };
  } catch (error) {
    console.error('Error getting exhibitor stats:', error);
    return {
      total: 0,
      maxExhibitors: 0,
      remaining: 0,
      usagePercentage: 0,
    };
  }
}

export async function getExhibitors(userId: number, role: string): Promise<Exhibitor[]> {
  try {
    const [rows] = await db.query<any[]>(
      role === 'admin' ?
      'SELECT * FROM exhibitors ORDER BY id DESC':
      'SELECT * FROM exhibitors WHERE user_id = ? ORDER BY id DESC',
      role === 'admin' ? [] : [userId]
    );
    return rows as Exhibitor[];
  } catch (error) {
    console.error('Error getting exhibitors:', error);
    return [];
  }
}

export async function addExhibitor(formData: {
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  company: string;
}) {
  try {
    // Verificar límite
    const stats = await getExhibitorStats(formData.user_id);
    if (stats.total >= stats.maxExhibitors) {
      return {
        success: false,
        error: 'Has alcanzado el límite de expositores permitidos',
      };
    }

    // Verificar email duplicado
    const [existing] = await db.query<any[]>(
      'SELECT id FROM exhibitors WHERE email = ? AND user_id = ?',
      [formData.email, formData.user_id]
    );

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: 'Ya existe un expositor con este email',
      };
    }

    const [result] = await db.query<any>(
      `INSERT INTO exhibitors (user_id, uuid, name, lastname, email, phone, position, company) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        formData.user_id,
        crypto.randomUUID(),
        formData.name,
        formData.lastname,
        formData.email,
        formData.phone,
        formData.position,
        formData.company,
      ]
    );

    // Obtener el exhibitor recién creado
    const [newExhibitor] = await db.query<any[]>(
      'SELECT * FROM exhibitors WHERE id = ?',
      [result.insertId]
    );

    revalidatePath('/dashboard/exhibitors');

    return {
      success: true,
      data: newExhibitor[0],
    };
  } catch (error) {
    console.error('Error adding exhibitor:', error);
    return {
      success: false,
      error: 'Error al crear el expositor',
    };
  }
}

export async function updateExhibitor(
  id: number,
  userId: number,
  formData: {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    position: string;
    company: string;
  }
) {
  try {
    // Verificar que el exhibitor pertenece al usuario
    const [existing] = await db.query<any[]>(
      'SELECT id FROM exhibitors WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existing || existing.length === 0) {
      return {
        success: false,
        error: 'Expositor no encontrado',
      };
    }

    // Verificar email duplicado (excluyendo el actual)
    const [duplicate] = await db.query<any[]>(
      'SELECT id FROM exhibitors WHERE email = ? AND user_id = ? AND id != ?',
      [formData.email, userId, id]
    );

    if (duplicate && duplicate.length > 0) {
      return {
        success: false,
        error: 'Ya existe un expositor con este email',
      };
    }

    await db.query(
      `UPDATE exhibitors 
       SET name = ?, lastname = ?, email = ?, phone = ?, position = ?, company = ? 
       WHERE id = ? AND user_id = ?`,
      [
        formData.name,
        formData.lastname,
        formData.email,
        formData.phone,
        formData.position,
        formData.company,
        id,
        userId,
      ]
    );

    // Obtener el exhibitor actualizado
    const [updatedExhibitor] = await db.query<any[]>(
      'SELECT * FROM exhibitors WHERE id = ?',
      [id]
    );

    revalidatePath('/dashboard/exhibitors');

    return {
      success: true,
      data: updatedExhibitor[0],
    };
  } catch (error) {
    console.error('Error updating exhibitor:', error);
    return {
      success: false,
      error: 'Error al actualizar el expositor',
    };
  }
}

export async function deleteExhibitor(id: number, userId: number) {
  try {
    // Verificar que el exhibitor pertenece al usuario
    const [existing] = await db.query<any[]>(
      'SELECT id FROM exhibitors WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existing || existing.length === 0) {
      return {
        success: false,
        error: 'Expositor no encontrado',
      };
    }

    await db.query('DELETE FROM exhibitors WHERE id = ? AND user_id = ?', [id, userId]);

    revalidatePath('/dashboard/exhibitors');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting exhibitor:', error);
    return {
      success: false,
      error: 'Error al eliminar el expositor',
    };
  }
}

const GOAL = 26325;

export async function getGlobalStats() {
  try {
    // Contar users principales
    const [res1]: any = await db_re_eco.query('SELECT COUNT(*) as cnt FROM users_2026');
    const [res2]: any = await db_re_eco.query('SELECT COUNT(*) as cnt FROM users_ecomondo_2026');

    const totalUsers = (res1[0]?.cnt || 0) + (res2[0]?.cnt || 0);

    // Contar estudiantes
    const [res3]: any = await db_re_eco.query('SELECT COUNT(*) as cnt FROM users_students_2026');
    const [res4]: any = await db_re_eco.query('SELECT COUNT(*) as cnt FROM users_ecomodo_students_2026');
    
    const totalStudents = (res3[0]?.cnt || 0) + (res4[0]?.cnt || 0);

    const percentage = GOAL > 0 ? Math.round((totalUsers / GOAL) * 10000) / 100 : 0;

    return { totalUsers, percentage, totalStudents, goal: GOAL };
  } catch (err) {
    console.error('Error fetching global stats:', err);
    return null;
  }
}
