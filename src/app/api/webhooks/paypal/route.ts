import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import db from '../../../../lib/db';
import crypto from 'crypto';
import ReceiptEmail from '../../../../components/email-receipt-template';

const resend = new Resend(process.env.RESEND_API_KEY);

// Función para verificar la firma del webhook de PayPal
async function verifyWebhookSignature(req: Request, body: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  
  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID not configured');
    return false;
  }

  const transmissionId = req.headers.get('paypal-transmission-id');
  const transmissionTime = req.headers.get('paypal-transmission-time');
  const certUrl = req.headers.get('paypal-cert-url');
  const transmissionSig = req.headers.get('paypal-transmission-sig');
  const authAlgo = req.headers.get('paypal-auth-algo');

  if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig || !authAlgo) {
    console.error('Missing webhook headers');
    return false;
  }

  try {
    // Construir el mensaje esperado
    const expectedMessage = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto.createHash('sha256').update(body).digest('hex')}`;
    
    // Obtener el certificado de PayPal
    const certResponse = await fetch(certUrl);
    const cert = await certResponse.text();

    // Verificar la firma
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(expectedMessage);
    
    const isValid = verifier.verify(cert, transmissionSig, 'base64');
    return isValid;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    // Verificar la firma del webhook (seguridad)
    const isValid = await verifyWebhookSignature(req, body);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    console.log('PayPal Webhook Event:', event.event_type);

    // Manejar diferentes tipos de eventos
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(event);
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        await handlePaymentFailed(event);
        break;
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentRefunded(event);
        break;
      
      default:
        console.log('Unhandled event type:', event.event_type);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCompleted(event: any) {
  try {
    const orderId = event.resource.supplementary_data?.related_ids?.order_id;
    
    if (!orderId) {
      console.error('Order ID not found in webhook');
      return;
    }

    // Buscar el pago en la base de datos
    const [payments]: any = await db.query(
      'SELECT * FROM exhibitor_payments WHERE payment_id = ? AND applied = FALSE',
      [orderId]
    );

    if (payments.length === 0) {
      console.log('Payment not found or already applied:', orderId);
      return;
    }

    const payment = payments[0];
    const newLimit = payment.previous_limit + payment.amount_slots;

    // Obtener datos del usuario
    const [users]: any = await db.query(
      'SELECT name, email, company FROM users WHERE id = ?',
      [payment.user_id]
    );

    if (users.length === 0) {
      console.error('User not found for payment:', payment.user_id);
      return;
    }

    const user = users[0];

    // Aplicar el límite al usuario
    await db.query(
      'UPDATE users SET maxexhibitors = ? WHERE id = ?',
      [newLimit, payment.user_id]
    );

    // Actualizar el registro del pago
    await db.query(
      `UPDATE exhibitor_payments 
       SET payment_status = 'COMPLETED', 
           new_limit = ?, 
           applied = TRUE, 
           completed_at = NOW() 
       WHERE id = ?`,
      [newLimit, payment.id]
    );

    console.log(`Payment completed and limit applied for user ${payment.user_id}`);
    
    // Enviar email de recibo
    try {
      const userLocale = 'es' as 'es' | 'en' | 'it'; // Default to Spanish for webhook emails
      

      await resend.emails.send({
        from: 'IGECO <noreply@igeco.mx>',
        to: user.email,
        subject: '✅ Pago confirmado - Espacios de expositores IGECO',
        react: ReceiptEmail({
            userName: user.name,
            userEmail: user.email,
            userCompany: user.company,
            quantity: payment.amount_slots,
            pricePerSlot: 300,
            totalAmount: parseFloat(payment.amount_paid),
            currency: payment.currency,
            paymentId: payment.payment_id,
            paymentDate: new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            }),
            previousLimit: payment.previous_limit,
            newLimit: newLimit,
            locale: userLocale,
        }),
      });

      console.log('Receipt email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Error sending receipt email:', emailError);
    }
    
  } catch (error) {
    console.error('Error handling payment completed:', error);
  }
}

async function handlePaymentFailed(event: any) {
  try {
    const orderId = event.resource.supplementary_data?.related_ids?.order_id;
    
    if (!orderId) {
      console.error('Order ID not found in webhook');
      return;
    }

    // Actualizar el estado del pago
    await db.query(
      `UPDATE exhibitor_payments 
       SET payment_status = 'FAILED' 
       WHERE payment_id = ? AND applied = FALSE`,
      [orderId]
    );

    console.log(`Payment failed for order ${orderId}`);
    
    // TODO: Enviar email de notificación al usuario
    
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handlePaymentRefunded(event: any) {
  try {
    const orderId = event.resource.supplementary_data?.related_ids?.order_id;
    
    if (!orderId) {
      console.error('Order ID not found in webhook');
      return;
    }

    // Buscar el pago aplicado
    const [payments]: any = await db.query(
      'SELECT * FROM exhibitor_payments WHERE payment_id = ? AND applied = TRUE',
      [orderId]
    );

    if (payments.length === 0) {
      console.log('Payment not found or not applied:', orderId);
      return;
    }

    const payment = payments[0];

    // Revertir el límite del usuario
    await db.query(
      'UPDATE users SET maxexhibitors = ? WHERE id = ?',
      [payment.previous_limit, payment.user_id]
    );

    // Actualizar el registro del pago
    await db.query(
      `UPDATE exhibitor_payments 
       SET payment_status = 'REFUNDED', 
           applied = FALSE 
       WHERE id = ?`,
      [payment.id]
    );

    console.log(`Payment refunded and limit reverted for user ${payment.user_id}`);
    
    // TODO: Enviar email de notificación al usuario
    
  } catch (error) {
    console.error('Error handling payment refunded:', error);
  }
}
