'use server';

import type { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/actions/exhibitors';
import { db_scanleads } from '@/lib/db';
import { registrationTypes, type RegistrationStatsResult } from '@/lib/registration-stats';

interface RegistrationStatsRow extends RowDataPacket {
  visitors: number | string;
  exhibitors: number | string;
  speakers: number | string;
  vip: number | string;
  media: number | string;
}

export async function getRegistrationStats(): Promise<RegistrationStatsResult> {
  const session = await getSession();

  if (!session || session.role !== 'admin' || session.status !== 1) {
    return { success: false, error: 'unauthorized' };
  }

  try {
    const columns = registrationTypes
      .map(({ key }) => `COUNT(CASE WHEN UPPER(TRIM(typeRegister)) = ? THEN 1 END) AS ${key}`)
      .join(',\n');
    const [rows] = await db_scanleads.query<RegistrationStatsRow[]>(
      `SELECT ${columns} FROM visitors_ste_2026`,
      registrationTypes.map(({ value }) => value)
    );
    const row = rows[0];

    if (!row) {
      throw new Error('Registration counts were not returned');
    }

    const counts = {
      visitors: Number(row.visitors),
      exhibitors: Number(row.exhibitors),
      speakers: Number(row.speakers),
      vip: Number(row.vip),
      media: Number(row.media),
    };

    if (Object.values(counts).some((count) => !Number.isSafeInteger(count) || count < 0)) {
      throw new Error('Invalid registration counts');
    }

    return {
      success: true,
      data: {
        counts,
        total: Object.values(counts).reduce((sum, count) => sum + count, 0),
      },
    };
  } catch (error) {
    console.error('Error fetching registration statistics:', error);
    return { success: false, error: 'unavailable' };
  }
}
