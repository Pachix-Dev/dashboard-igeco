import type { RowDataPacket } from 'mysql2';
import db from '@/lib/db';

// Shared by the user list and the rows returned after creating or editing a user.
export const scanLeadsSummaryColumns = `
  (SELECT COALESCE(SUM(quantity), 0) FROM scanleads_payments
   WHERE user_id = users.id AND payment_status = 'COMPLETED' AND currency = 'MXN') AS scanleads_paid_licenses`;

export async function getScanLeadsPurchaseSummary(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(quantity), 0) AS paid_licenses,
            COALESCE(SUM(amount_paid), 0) AS total_paid
     FROM scanleads_payments
     WHERE user_id = ? AND payment_status = 'COMPLETED' AND currency = 'MXN'`,
    [userId]
  );
  return {
    paidLicenses: Number(rows[0]?.paid_licenses ?? 0),
    totalPaid: Number(rows[0]?.total_paid ?? 0),
  };
}
