'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  maxsessions: number;
}

interface ActiveSession {
  id: number;
  user_id: number;
  session_token: string;
  device_info?: string;
  ip_address?: string;
  user_agent?: string;
  last_activity: string;
  created_at: string;
  is_current?: boolean;
}

export async function getCurrentUserId(): Promise<number | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    return payload.id;
  } catch {
    return null;
  }
}

export async function getUserSessions(): Promise<{ sessions: ActiveSession[]; maxSessions: number; currentToken: string } | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const cookieStore = cookies();
    const currentToken = cookieStore.get('access_token')?.value || '';

    // Obtener maxsessions del usuario
    const [userRows]: any = await db.query(
      'SELECT maxsessions FROM users WHERE id = ?',
      [userId]
    );
    const maxSessions = userRows[0]?.maxsessions || 0;

    // Obtener sesiones activas (últimas 24 horas)
    const [sessions]: any = await db.query(
      `SELECT id, user_id, session_token, device_info, ip_address, user_agent, last_activity, created_at 
       FROM active_sessions 
       WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY last_activity DESC`,
      [userId]
    );

    // Marcar sesión actual
    const sessionsWithCurrent = sessions.map((s: ActiveSession) => ({
      ...s,
      is_current: s.session_token === currentToken,
    }));

    return { sessions: sessionsWithCurrent, maxSessions, currentToken };
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return null;
  }
}

export async function registerSession(deviceInfo?: string, ipAddress?: string, userAgent?: string): Promise<{ success: boolean; error?: string; sessionsToClose?: ActiveSession[] }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: 'Usuario no autenticado' };

    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return { success: false, error: 'Token no encontrado' };

    // Verificar si ya existe esta sesión
    const [existing]: any = await db.query(
      'SELECT id FROM active_sessions WHERE session_token = ?',
      [token]
    );

    if (existing.length > 0) {
      // Actualizar last_activity
      await db.query(
        'UPDATE active_sessions SET last_activity = NOW(), device_info = ?, ip_address = ?, user_agent = ? WHERE session_token = ?',
        [deviceInfo || null, ipAddress || null, userAgent || null, token]
      );
      return { success: true };
    }

    // Obtener maxsessions y contar sesiones activas
    const [userRows]: any = await db.query(
      'SELECT maxsessions FROM users WHERE id = ?',
      [userId]
    );
    const maxSessions = userRows[0]?.maxsessions || 0;

    const [activeSessions]: any = await db.query(
      `SELECT id, session_token, device_info, last_activity, created_at 
       FROM active_sessions 
       WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY last_activity DESC`,
      [userId]
    );

    // Si alcanzó el límite, retornar las sesiones para que el usuario elija cuál cerrar
    if (activeSessions.length >= maxSessions && maxSessions > 0) {
      return {
        success: false,
        error: 'Límite de sesiones alcanzado',
        sessionsToClose: activeSessions,
      };
    }

    // Registrar nueva sesión
    await db.query(
      'INSERT INTO active_sessions (user_id, session_token, device_info, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId, token, deviceInfo || null, ipAddress || null, userAgent || null]
    );

    return { success: true };
  } catch (error) {
    console.error('Error registering session:', error);
    return { success: false, error: 'Error al registrar sesión' };
  }
}

export async function closeSession(sessionId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: 'Usuario no autenticado' };

    // Verificar que la sesión pertenece al usuario
    const [session]: any = await db.query(
      'SELECT user_id FROM active_sessions WHERE id = ?',
      [sessionId]
    );

    if (!session.length || session[0].user_id !== userId) {
      return { success: false, error: 'Sesión no encontrada' };
    }

    await db.query('DELETE FROM active_sessions WHERE id = ?', [sessionId]);
    revalidatePath('/[locale]/dashboard/scan-leads');
    return { success: true };
  } catch (error) {
    console.error('Error closing session:', error);
    return { success: false, error: 'Error al cerrar sesión' };
  }
}

export async function cleanupExpiredSessions(userId: number): Promise<void> {
  try {
    await db.query(
      'DELETE FROM active_sessions WHERE user_id = ? AND last_activity < DATE_SUB(NOW(), INTERVAL 24 HOUR)',
      [userId]
    );
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

export async function recordSessionPayment(data: {
  paymentId: string;
  amountSlots: number;
  amountPaid: number;
  currency: string;
  paymentStatus: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: 'Usuario no autenticado' };

    // Obtener límite actual
    const [userRows]: any = await db.query(
      'SELECT maxsessions FROM users WHERE id = ?',
      [userId]
    );
    const previousLimit = userRows[0]?.maxsessions || 0;
    const newLimit = previousLimit + data.amountSlots;

    await db.query(
      `INSERT INTO session_payments 
       (user_id, payment_id, amount_slots, amount_paid, currency, previous_limit, new_limit, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, data.paymentId, data.amountSlots, data.amountPaid, data.currency, previousLimit, newLimit, data.paymentStatus]
    );

    // Si el pago fue exitoso, actualizar maxsessions
    if (data.paymentStatus === 'COMPLETED') {
      await db.query(
        'UPDATE users SET maxsessions = ? WHERE id = ?',
        [newLimit, userId]
      );
      await db.query(
        'UPDATE session_payments SET applied = 1, completed_at = NOW() WHERE payment_id = ?',
        [data.paymentId]
      );
    }

    revalidatePath('/[locale]/dashboard/scan-leads');
    return { success: true };
  } catch (error) {
    console.error('Error recording session payment:', error);
    return { success: false, error: 'Error al registrar pago' };
  }
}
