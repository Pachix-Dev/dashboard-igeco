import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import db from '../../../../lib/db';
import ReceiptEmail from '../../../../components/email-receipt-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface IncreaseLimitRequest {
  user_id: number;
  additional_slots: number;
  payment_id: string;
  payment_status: string;
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
    const { user_id, additional_slots, payment_id, payment_status, locale } = await req.json() as IncreaseLimitRequest;
    const userLocale = (locale || 'es') as 'es' | 'en' | 'it';

    // Validar campos requeridos
    if (!user_id || !additional_slots || !payment_id || !payment_status) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
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

    // Obtener información del pago
    const paypalStatus = paypalOrder.status;
    const paidAmount = paypalOrder.purchase_units[0].amount.value;
    const currency = paypalOrder.purchase_units[0].amount.currency_code;
    
    // Validar que el monto es correcto (300 MXN por slot)
    const expectedAmount = (additional_slots * 300).toFixed(2);
    if (paidAmount !== expectedAmount) {
      return NextResponse.json(
        { message: 'El monto del pago no coincide con la cantidad de espacios' },
        { status: 400 }
      );
    }

    // Validar cantidad de slots
    if (additional_slots < 1 || additional_slots > 50) {
      return NextResponse.json(
        { message: 'La cantidad de slots debe estar entre 1 y 50' },
        { status: 400 }
      );
    }

    // Obtener el límite actual del usuario y sus datos
    const [users]: any = await db.query(
      'SELECT id, name, email, company, maxexhibitors FROM users WHERE id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = users[0];
    const currentLimit = user.maxexhibitors || 0;

    // Si el pago está PENDING, registrar pero NO aplicar límite
    if (paypalStatus === 'PENDING') {
      try {
        await db.query(
          `INSERT INTO exhibitor_payments 
          (user_id, payment_id, amount_slots, amount_paid, currency, previous_limit, new_limit, payment_status, applied) 
          VALUES (?, ?, ?, ?, ?, ?, NULL, 'PENDING', FALSE)`,
          [user_id, payment_id, additional_slots, paidAmount, currency, currentLimit]
        );
      } catch (error) {
        console.log('Payment logging skipped - table may not exist');
      }

      return NextResponse.json({
        message: 'Pago pendiente de confirmación. Te notificaremos cuando se complete.',
        status: 'PENDING',
        previous_limit: currentLimit,
        additional_slots,
      }, { status: 202 }); // 202 Accepted
    }

    // Si el pago está COMPLETED, aplicar el límite
    if (paypalStatus === 'COMPLETED') {
      const newLimit = currentLimit + additional_slots;

      // Actualizar el límite en la base de datos
      await db.query(
        'UPDATE users SET maxexhibitors = ? WHERE id = ?',
        [newLimit, user_id]
      );

      // Registrar la transacción
      try {
        await db.query(
          `INSERT INTO exhibitor_payments 
          (user_id, payment_id, amount_slots, amount_paid, currency, previous_limit, new_limit, payment_status, applied, completed_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED', TRUE, NOW())`,
          [user_id, payment_id, additional_slots, paidAmount, currency, currentLimit, newLimit]
        );
      } catch (error) {
        console.log('Payment logging skipped - table may not exist');
      }

      // Enviar email de recibo
      try {
        
        await resend.emails.send({
          from: 'IGECO <noreply@igeco.mx>',
          to: user.email,
          subject: 'Recibo de compra - Gafetes adicionales de expositores IGECO',
          react: ReceiptEmail({
            userName: user.name,
            userEmail: user.email,
            userCompany: user.company,
            quantity: additional_slots,
            pricePerSlot: 300,
            totalAmount: parseFloat(paidAmount),
            currency: currency,
            paymentId: payment_id,
            paymentDate: new Date().toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            previousLimit: currentLimit,
            newLimit: newLimit,
            locale: userLocale,
            }),
        });

        console.log('Receipt email sent successfully to:', user.email);
      } catch (emailError) {
        console.error('Error sending receipt email:', emailError);
        // No fallar la transacción si el email falla
      }

      return NextResponse.json({
        message: 'Límite actualizado exitosamente',
        status: 'COMPLETED',
        previous_limit: currentLimit,
        new_limit: newLimit,
        additional_slots,
      }, { status: 200 });
    }

    // Cualquier otro estado (FAILED, CANCELLED, etc.)
    return NextResponse.json(
      { message: `Estado de pago no válido: ${paypalStatus}` },
      { status: 400 }
    );

  } catch (err: any) {
    console.error('Error increasing exhibitor limit:', err);
    return NextResponse.json(
      { message: 'Error al aumentar el límite. Por favor, contacta soporte.' },
      { status: 500 }
    );
  }
}
