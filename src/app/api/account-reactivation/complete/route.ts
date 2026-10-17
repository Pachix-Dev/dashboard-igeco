import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import db from '@/lib/db';
import { getPayPalOrder } from '@/lib/paypal-orders';
import AccountReactivationReceipt from '@/components/email-account-reactivation-receipt';

interface SessionPayload {
  id: number;
  email: string;
  role: string;
  status?: number;
  document_penalty_required?: number;
  document_penalty_paid?: number;
  document_penalty_waived?: number;
  document_penalty_locked_by_admin?: number;
  maxsessions?: number;
  event?: string | null;
  company?: string | null;
}

const REACTIVATION_AMOUNT_MXN = 8537;
const REACTIVATION_CURRENCY = 'MXN';
const resend = new Resend(process.env.RESEND_API_KEY);

const normalizePayPalStatus = (status: string): string => {
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'APPROVED' || status === 'PAYER_ACTION_REQUIRED') return 'PENDING';
  if (status === 'VOIDED' || status === 'DECLINED' || status === 'CANCELLED') return 'FAILED';
  return 'PENDING';
};

const issueAccessToken = (payload: SessionPayload, status: number) =>
  jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      status,
      document_penalty_required: payload.document_penalty_required ?? 0,
      document_penalty_paid: payload.document_penalty_paid ?? 0,
      document_penalty_waived: payload.document_penalty_waived ?? 0,
      document_penalty_locked_by_admin: payload.document_penalty_locked_by_admin ?? 0,
      maxsessions: payload.maxsessions,
      event: payload.event,
      company: payload.company
    },
    process.env.JWT_SECRET || 'tu_secreto_jwt',
    { expiresIn: '7d' }
  );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const userId = Number(body?.user_id ?? 0);
    const paymentId = String(body?.payment_id || body?.orderId || '').trim();
    const paymentStatusInput = String(body?.payment_status || '').trim();
    const locale = body?.locale === 'en' || body?.locale === 'it' ? body.locale : 'es';

    if (!userId || !paymentId || !paymentStatusInput) {
      return NextResponse.json({ message: 'user_id, payment_id y payment_status son requeridos' }, { status: 400 });
    }

    const token = cookies().get('access_token')?.value;
    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = (await jwtVerify(token, secret)) as { payload: SessionPayload };

    const [userRows] = await db.query<any[]>(
      `SELECT id, email, role, status, document_penalty_required, document_penalty_paid,
              document_penalty_waived, document_penalty_locked_by_admin, event, company
       FROM users WHERE id = ? LIMIT 1`,
      [payload.id]
    );

    if (!userRows.length) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = userRows[0];
    if (Number(user.id) !== userId) {
      return NextResponse.json({ message: 'El usuario de la operación no coincide con la sesión autenticada' }, { status: 403 });
    }

    if (user.role !== 'exhibitor' && user.role !== 'exhibitorplus') {
      return NextResponse.json({ message: 'Solo expositores pueden reactivar su cuenta' }, { status: 403 });
    }

    const paypalOrder = await getPayPalOrder(paymentId);
    const purchaseUnit = paypalOrder?.purchase_units?.[0];
    const amountValue = Number(purchaseUnit?.amount?.value || 0);
    const amountCurrency = String(purchaseUnit?.amount?.currency_code || '');
    const customId = String(purchaseUnit?.custom_id || '');
    const paymentStatus = normalizePayPalStatus(String(paypalOrder?.status || paymentStatusInput));

    if (customId && Number(customId) !== Number(user.id)) {
      return NextResponse.json({ message: 'La orden de PayPal no pertenece al usuario autenticado' }, { status: 400 });
    }

    if (amountCurrency !== REACTIVATION_CURRENCY || Number(amountValue.toFixed(2)) !== Number(REACTIVATION_AMOUNT_MXN.toFixed(2))) {
      return NextResponse.json(
        { message: 'El monto o moneda del pago no coincide con la multa de reactivación' },
        { status: 400 }
      );
    }

    const [existingRows] = await db.query<any[]>(
      'SELECT id, payment_status FROM document_reactivation_payments WHERE paypal_order_id = ? LIMIT 1',
      [paymentId]
    );

    if (!existingRows.length) {
      await db.query(
        `INSERT INTO document_reactivation_payments
         (user_id, paypal_order_id, amount_paid, currency, payment_status, created_at, updated_at, completed_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)` ,
        [user.id, paymentId, amountValue, amountCurrency, paymentStatus, paymentStatus === 'COMPLETED' ? new Date() : null]
      );
    } else {
      await db.query(
        `UPDATE document_reactivation_payments
         SET payment_status = ?,
             amount_paid = ?,
             currency = ?,
             updated_at = NOW(),
             completed_at = CASE WHEN ? = 'COMPLETED' THEN NOW() ELSE completed_at END
         WHERE id = ?`,
        [paymentStatus, amountValue, amountCurrency, paymentStatus, existingRows[0].id]
      );
    }

    if (paymentStatus !== 'COMPLETED') {
      const statusCode = paymentStatus === 'PENDING' ? 202 : 400;
      return NextResponse.json(
        {
          status: paymentStatus,
          message:
            paymentStatus === 'PENDING'
              ? 'Pago pendiente de confirmación por PayPal'
              : 'No fue posible confirmar el pago de reactivación'
        },
        { status: statusCode }
      );
    }

    await db.query(
      `UPDATE users
       SET document_penalty_paid = 1,
           document_penalty_locked_by_admin = 0
       WHERE id = ?`,
      [user.id]
    );

    const refreshedToken = issueAccessToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        document_penalty_required: user.document_penalty_required,
        document_penalty_paid: 1,
        document_penalty_waived: user.document_penalty_waived,
        document_penalty_locked_by_admin: 0,
        maxsessions: payload.maxsessions,
        event: user.event,
        company: user.company
      },
      Number(user.status ?? 1)
    );

    const response = NextResponse.json(
      { status: 'COMPLETED', message: 'Pago confirmado. Acceso al expediente restablecido.' },
      { status: 200 }
    );

    try {
      const emailSubject =
        locale === 'es'
          ? 'Comprobante de pago - Reactivación documental IGECO'
          : locale === 'en'
            ? 'Payment receipt - IGECO document reactivation'
            : 'Ricevuta pagamento - Riattivazione documentale IGECO';

      await resend.emails.send({
        from: 'IGECO <noreply@igeco.mx>',
        to: user.email,
        cc: 'jesus.zermeno@igeco.mx',
        subject: emailSubject,
        react: AccountReactivationReceipt({
          userName: user.company || user.email,
          userEmail: user.email,
          userCompany: user.company || undefined,
          totalAmount: amountValue,
          currency: amountCurrency,
          paymentId,
          paymentDate: new Date().toLocaleDateString(
            locale === 'es' ? 'es-MX' : locale === 'en' ? 'en-US' : 'it-IT',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          ),
          locale
        }),
      });
    } catch (emailError) {
      console.error('Error sending reactivation receipt email:', emailError);
    }

    response.cookies.set('access_token', refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error confirming reactivation payment:', error);
    return NextResponse.json(
      { message: 'No se pudo confirmar el pago de reactivación. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
