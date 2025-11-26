import { NextResponse } from 'next/server';
import { db_re_eco } from '../../../lib/db';


// Meta objetivo
const GOAL = 26325;

export async function GET() {
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

    return NextResponse.json({ totalUsers, percentage, totalStudents, goal: GOAL }, { status: 200 });
  } catch (err) {
    console.error('Error fetching db counts:', err);
    return NextResponse.json({ message: 'Error fetching counts' }, { status: 500 });
  }
}
