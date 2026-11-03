import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import db from '@/lib/db';
import ScanLeadsReceipt from '@/components/email-scanleads-receipt';
import type { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/actions/exhibitors';
import { getScanLeadsPurchaseSummary } from '@/lib/scanleads-payments';
import {
  amountInCents, isScanLeadsQuantity, scanLeadsPaymentReference,
  SCANLEADS_CURRENCY, SCANLEADS_MODULE_PRICE_CENTS,
} from '@/lib/scanleads-pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ActivateRequest {
  user_id?: number;
  payment_id: string;
  payment_status?: string;
  quantity?: number;
  locale?: 'es' | 'en' | 'it';
}

// Función para obtener el access token de PayPal
async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Función para verificar el pago con PayPal
async function verifyPayPalPayment(paymentId: string) {
  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment with PayPal');
  }

  return await response.json();
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Sesión requerida' }, { status: 401 });

    let input: ActivateRequest;
    try {
      input = await req.json();
    } catch {
      return NextResponse.json({ message: 'Solicitud no válida' }, { status: 400 });
    }
    if (!input || typeof input !== 'object') {
      return NextResponse.json({ message: 'Solicitud no válida' }, { status: 400 });
    }
    const { user_id, payment_id, locale, quantity = 1 } = input;
    const userLocale = locale === 'en' || locale === 'it' ? locale : 'es';
    if (user_id !== undefined && user_id !== session.id) {
      return NextResponse.json({ message: 'La compra no pertenece al usuario autenticado' }, { status: 403 });
    }
    if (typeof payment_id !== 'string' || !/^[a-z0-9]{1,100}$/i.test(payment_id)
      || !isScanLeadsQuantity(quantity)) {
      return NextResponse.json({ message: 'Identificador de pago o cantidad no válidos' }, { status: 400 });
    }

    const [existingPayments] = await db.query<RowDataPacket[]>(
      'SELECT user_id, quantity, payment_status FROM scanleads_payments WHERE payment_id = ?',
      [payment_id]
    );
    const existingPayment = existingPayments[0];
    if (existingPayment && Number(existingPayment.user_id) !== session.id) {
      return NextResponse.json({ message: 'El pago ya pertenece a otro usuario' }, { status: 409 });
    }
    if (existingPayment?.payment_status === 'COMPLETED') {
      return NextResponse.json({
        message: 'Pago registrado previamente', status: 'COMPLETED',
        quantity: Number(existingPayment.quantity),
        ...await getScanLeadsPurchaseSummary(session.id),
      });
    }
    if (existingPayment && Number(existingPayment.quantity) !== quantity) {
      return NextResponse.json({ message: 'La cantidad no coincide con la compra registrada' }, { status: 409 });
    }
    if (existingPayment && !['PENDING', 'CREATED'].includes(existingPayment.payment_status)) {
      return NextResponse.json({ message: 'El pago no puede volver a activarse' }, { status: 409 });
    }

    // Verificar el pago directamente con PayPal API
    let paypalOrder;
    try {
      paypalOrder = await verifyPayPalPayment(payment_id);
    } catch (error) {
      console.error('PayPal verification error:', error);
      return NextResponse.json(
        { message: 'No se pudo verificar el pago con PayPal' },
        { status: 400 }
      );
    }

    const purchaseUnit = paypalOrder.purchase_units?.[0];
    // La referencia devuelta por PayPal identifica el servicio, usuario y cantidad.
    // Las compras pendientes anteriores a esta migración no incluían custom_id.
    const isLegacyPayment = existingPayment && quantity === 1 && !purchaseUnit?.custom_id;
    if (paypalOrder.purchase_units?.length !== 1 || !purchaseUnit
      || (!isLegacyPayment && purchaseUnit.custom_id !== scanLeadsPaymentReference(session.id, quantity))) {
      return NextResponse.json({ message: 'La orden no corresponde a esta compra de licencias' }, { status: 400 });
    }
    const capture = purchaseUnit.payments?.captures?.[0];
    if (!capture || purchaseUnit.payments.captures.length !== 1) {
      return NextResponse.json({ message: 'El pago todavía no tiene una captura confirmada' }, { status: 400 });
    }
    const paypalStatus = capture.status;
    const paidAmount = capture.amount?.value;
    const currency = capture.amount?.currency_code;
    const expectedAmountCents = SCANLEADS_MODULE_PRICE_CENTS * quantity;
    if (amountInCents(paidAmount) !== expectedAmountCents
      || amountInCents(purchaseUnit.amount?.value) !== expectedAmountCents
      || currency !== SCANLEADS_CURRENCY || purchaseUnit.amount?.currency_code !== SCANLEADS_CURRENCY) {
      return NextResponse.json({ message: 'El importe o la moneda no coinciden con las licencias compradas' }, { status: 400 });
    }
    if (paypalStatus !== 'COMPLETED' && paypalStatus !== 'PENDING') {
      return NextResponse.json({ message: `Estado de pago no válido: ${paypalStatus}`, status: paypalStatus }, { status: 400 });
    }

    const [users] = await db.query<RowDataPacket[]>(
      'SELECT id, name, email, company FROM users WHERE id = ?',
      [session.id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = users[0];

    const connection = await db.getConnection();
    let newlyCompleted = false;
    let recordedStatus = paypalStatus;
    try {
      await connection.beginTransaction();
      // Serializar compras de la misma cuenta, incluidos reintentos simultáneos.
      const [lockedUsers] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE id = ? FOR UPDATE', [session.id]
      );
      if (!lockedUsers.length) throw new Error('Usuario no encontrado');
      const [payments] = await connection.query<RowDataPacket[]>(
        'SELECT user_id, quantity, payment_status FROM scanleads_payments WHERE payment_id = ? FOR UPDATE',
        [payment_id]
      );
      const payment = payments[0];
      if (payment && (Number(payment.user_id) !== session.id || Number(payment.quantity) !== quantity)) {
        throw new Error('El pago ya está asociado a otra compra');
      }
      if (payment?.payment_status === 'COMPLETED') {
        recordedStatus = 'COMPLETED';
      } else {
        if (payment && !['PENDING', 'CREATED'].includes(payment.payment_status)) {
          throw new Error('El pago no puede volver a activarse');
        }
        if (payment) {
          await connection.query(
            `UPDATE scanleads_payments SET amount_paid = ?, payment_status = ?,
             completed_at = CASE WHEN ? = 'COMPLETED' THEN NOW() ELSE NULL END WHERE payment_id = ?`,
            [paidAmount, paypalStatus, paypalStatus, payment_id]
          );
        } else {
          await connection.query(
            `INSERT INTO scanleads_payments
             (user_id, payment_id, quantity, amount_paid, currency, payment_status, completed_at)
             VALUES (?, ?, ?, ?, ?, ?, CASE WHEN ? = 'COMPLETED' THEN NOW() ELSE NULL END)`,
            [session.id, payment_id, quantity, paidAmount, currency, paypalStatus, paypalStatus]
          );
        }
        if (paypalStatus === 'COMPLETED') {
          await connection.query('UPDATE users SET scanleads_purchased = 1 WHERE id = ?', [session.id]);
          newlyCompleted = true;
        }
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    if (newlyCompleted) {

      // Enviar email de confirmación
      try {
        const emailSubject = userLocale === 'es' 
          ? '🎉 Módulo Scan Leads Activado - IGECO'
          : userLocale === 'en'
          ? '🎉 Scan Leads Module Activated - IGECO'
          : '🎉 Modulo Scan Leads Attivato - IGECO';

        await resend.emails.send({
          from: 'IGECO <noreply@igeco.mx>',
          to: user.email,
          subject: emailSubject,
          react: ScanLeadsReceipt({
            userName: user.name,
            userEmail: user.email,
            userCompany: user.company,
            totalAmount: Number(paidAmount),
            quantity,
            currency: currency,
            paymentId: payment_id,
            paymentDate: new Date().toLocaleDateString(userLocale === 'es' ? 'es-MX' : userLocale === 'en' ? 'en-US' : 'it-IT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            locale: userLocale,
          }),
        });

        console.log('Scan Leads activation email sent successfully to:', user.email);
      } catch (emailError) {
        console.error('Error sending activation email:', emailError);
        // No fallar la transacción si el email falla
      }

    }
    return NextResponse.json({
      message: recordedStatus === 'COMPLETED'
        ? 'Licencias registradas exitosamente'
        : 'Pago pendiente. Consulta nuevamente su estado o contacta a soporte.',
      status: recordedStatus,
      quantity,
      ...await getScanLeadsPurchaseSummary(session.id),
    }, { status: recordedStatus === 'COMPLETED' ? 200 : 202 });

  } catch (err: any) {
    console.error('Error activating scan leads module:', err);
    return NextResponse.json(
      { message: 'Error al activar el módulo. Por favor, contacta soporte.' },
      { status: 500 }
    );
  }
}
