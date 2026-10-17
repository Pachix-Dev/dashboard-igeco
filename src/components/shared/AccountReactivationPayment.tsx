'use client';

import { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

interface AccountReactivationPaymentProps {
  userId: number;
  missingDocuments: string[];
}

export function AccountReactivationPayment({ userId, missingDocuments }: AccountReactivationPaymentProps) {
  const locale = useLocale();
  const t = useTranslations('AccountReactivation');
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const paypalLocale = locale === 'es' ? 'es_MX' : locale === 'en' ? 'en_US' : 'it_IT';
  const amountMxn = '8537.00';

  const handlePaymentCompleted = async (paymentId: string, paymentStatus: string) => {
    const response = await fetch('/api/account-reactivation/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        payment_id: paymentId,
        payment_status: paymentStatus,
        locale
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || t('messages.error'));
    }

    if (result.status === 'COMPLETED') {
      setFeedback({ type: 'success', message: t('messages.success') });
      setTimeout(() => {
        router.push('/dashboard', { locale: locale as 'es' | 'en' | 'it' });
      }, 1200);
      return;
    }

    if (result.status === 'PENDING') {
      setFeedback({ type: 'info', message: t('messages.pending') });
      return;
    }

    throw new Error(result?.message || t('messages.error'));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('badge')}</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{t('title')}</h1>
          <p className="text-slate-300">{t('subtitle')}</p>
        </header>

        <article className="space-y-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 shadow-xl shadow-amber-500/10">
          <div>
            <h2 className="text-lg font-semibold text-amber-100">{t('reasonTitle')}</h2>
            <p className="mt-2 text-sm text-amber-200/90">{t('reasonDescription')}</p>
            <ul className="mt-4 list-disc space-y-1 pl-6 text-sm text-amber-100">
              {missingDocuments.map((documentName) => (
                <li key={documentName}>{documentName}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm text-slate-300">{t('fineLabel')}</p>
            <p className="mt-1 text-2xl font-bold text-white">$8,537 MXN</p>
            <p className="text-sm text-slate-400">{t('usdEquivalent')}</p>
          </div>

          {feedback && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                  : feedback.type === 'info'
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-100'
                    : 'border-red-500/30 bg-red-500/10 text-red-100'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-slate-300">{t('paypalDescription')}</p>
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: 'MXN',
                locale: paypalLocale
              }}
            >
              <PayPalButtons
                createOrder={(_data, actions) =>
                  actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                      {
                        custom_id: String(userId),
                        description: 'Document compliance reactivation fine',
                        amount: {
                          currency_code: 'MXN',
                          value: amountMxn
                        }
                      }
                    ],
                    application_context: {
                      shipping_preference: 'NO_SHIPPING'
                    }
                  })
                }
                onApprove={async (_data, actions) => {
                  setIsProcessing(true);
                  setFeedback(null);
                  try {
                    if (!actions.order) {
                      throw new Error(t('messages.error'));
                    }
                    const order = await actions.order.capture();
                    await handlePaymentCompleted(String(order.id || ''), String(order.status || ''));
                  } catch (error) {
                    console.error('Error processing reactivation payment:', error);
                    setFeedback({
                      type: 'error',
                      message: error instanceof Error ? error.message : t('messages.error')
                    });
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                onCancel={() => {
                  setFeedback({ type: 'info', message: t('messages.cancelled') });
                  setIsProcessing(false);
                }}
                onError={(error) => {
                  console.error('PayPal checkout error:', error);
                  setFeedback({ type: 'error', message: t('messages.error') });
                  setIsProcessing(false);
                }}
                disabled={isProcessing}
                style={{
                  layout: 'vertical',
                  color: 'gold',
                  shape: 'rect',
                  label: 'paypal',
                  height: 48
                }}
                forceReRender={[paypalLocale]}
              />
            </PayPalScriptProvider>
          </div>
        </article>
      </section>
    </main>
  );
}
