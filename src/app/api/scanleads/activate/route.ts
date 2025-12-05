import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import db from '@/lib/db';
import ScanLeadsReceipt from '@/components/email-scanleads-receipt';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ActivateRequest {
  user_id: number;
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
    const { user_id, payment_id, payment_status, locale } = await req.json() as ActivateRequest;
    const userLocale = (locale || 'es') as 'es' | 'en' | 'it';

    // Validar campos requeridos
    if (!user_id || !payment_id || !payment_status) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya tiene el módulo activado
    const [existingUsers]: any = await db.query(
      'SELECT scanleads_purchased FROM users WHERE id = ?',
      [user_id]
    );

    if (existingUsers.length > 0 && existingUsers[0].scanleads_purchased === 1) {
      return NextResponse.json(
        { message: 'El módulo ya está activado para este usuario' },
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
    
    // Validar que el monto es correcto (10,750 MXN)
    const expectedAmount = '10750.00';
    if (parseFloat(paidAmount) !== parseFloat(expectedAmount)) {
      return NextResponse.json(
        { message: 'El monto del pago no coincide con el precio del módulo' },
        { status: 400 }
      );
    }

    // Obtener datos del usuario
    const [users]: any = await db.query(
      'SELECT id, name, email, company FROM users WHERE id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Si el pago está COMPLETED, activar el módulo
    if (paypalStatus === 'COMPLETED') {
      // Actualizar scanleads_purchased a 1
      await db.query(
        'UPDATE users SET scanleads_purchased = 1 WHERE id = ?',
        [user_id]
      );

      // Registrar la transacción (puedes crear una tabla scanleads_payments si quieres)
      try {
        await db.query(
          `INSERT INTO scanleads_payments 
          (user_id, payment_id, amount_paid, currency, payment_status, completed_at) 
          VALUES (?, ?, ?, ?, 'COMPLETED', NOW())`,
          [user_id, payment_id, paidAmount, currency]
        );
      } catch (error) {
        console.log('Payment logging skipped - table may not exist');
      }

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
            totalAmount: parseFloat(paidAmount),
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

      return NextResponse.json({
        message: 'Módulo activado exitosamente',
        status: 'COMPLETED',
      }, { status: 200 });
    }

    // Si el pago está PENDING
    if (paypalStatus === 'PENDING') {
      try {
        await db.query(
          `INSERT INTO scanleads_payments 
          (user_id, payment_id, amount_paid, currency, payment_status) 
          VALUES (?, ?, ?, ?, 'PENDING')`,
          [user_id, payment_id, paidAmount, currency]
        );
      } catch (error) {
        console.log('Payment logging skipped - table may not exist');
      }

      return NextResponse.json({
        message: 'Pago pendiente de confirmación. Te notificaremos cuando se complete.',
        status: 'PENDING',
      }, { status: 202 });
    }

    // Cualquier otro estado (FAILED, CANCELLED, etc.)
    return NextResponse.json(
      { message: `Estado de pago no válido: ${paypalStatus}` },
      { status: 400 }
    );

  } catch (err: any) {
    console.error('Error activating scan leads module:', err);
    return NextResponse.json(
      { message: 'Error al activar el módulo. Por favor, contacta soporte.' },
      { status: 500 }
    );
  }
}
