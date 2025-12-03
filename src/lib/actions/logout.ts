'use server';

import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function logout() {
  const token = cookies().get('access_token')?.value;

  // Delete session from database
  if (token) {
    try {
      await db.query('DELETE FROM user_sessions WHERE session_token = ?', [token]);
    } catch (error) {
      console.error('Error deleting session from database:', error);
    }
  }

  // Clear auth cookie
  try {
    cookies().delete('access_token');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
