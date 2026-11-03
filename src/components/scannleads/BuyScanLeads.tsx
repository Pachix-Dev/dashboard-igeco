'use client'

import { useEffect, useRef, useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useLocale, useTranslations } from 'next-intl'
import { useToaster } from '@/context/ToasterContext'
import {
  isScanLeadsQuantity, scanLeadsPaymentReference, SCANLEADS_CURRENCY,
  SCANLEADS_MAX_QUANTITY, SCANLEADS_MODULE_PRICE_CENTS,
} from '@/lib/scanleads-pricing'

interface BuyScanLeadsProps {
  userId: number;
}

type UnconfirmedPayment = { paymentId: string; quantity: number }

export function BuyScanLeads({ userId }: BuyScanLeadsProps) {
  
  const locale = useLocale()
  const t = useTranslations('ScanLeadsPurchase')
  const { notify } = useToaster()
  const [isProcessing, setIsProcessing] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [unconfirmedPayment, setUnconfirmedPayment] = useState<UnconfirmedPayment | null>(null)
  const checkoutQuantity = useRef(1)
  const storageKey = `scanleads-payment:${userId}`
  const totalPrice = quantity * SCANLEADS_MODULE_PRICE_CENTS / 100
  const formatPrice = (amount: number) => new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount)

  useEffect(() => {
    setUnconfirmedPayment(null)
    setQuantity(1)
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || 'null')
      if (stored && typeof stored.paymentId === 'string' && /^[a-z0-9]{1,100}$/i.test(stored.paymentId)
        && isScanLeadsQuantity(stored.quantity)) {
        setUnconfirmedPayment(stored)
        setQuantity(stored.quantity)
      }
    } catch {
      // El pago sigue funcionando cuando el navegador bloquea el almacenamiento.
    }
  }, [storageKey])

  const rememberPayment = (payment: UnconfirmedPayment | null) => {
    setUnconfirmedPayment(payment)
    try {
      if (payment) localStorage.setItem(storageKey, JSON.stringify(payment))
      else localStorage.removeItem(storageKey)
    } catch {}
  }
  
  // Map current locale to PayPal locale format
  const paypalLocale = locale === 'es' ? 'es_MX' : locale === 'en' ? 'en_US' : 'it_IT'
   
  const createOrder = async (data: any, actions: any) => {
    checkoutQuantity.current = quantity
    setIsCheckoutOpen(true)
    try {
      return await actions.order.create({
        intent: 'CAPTURE',
        purchase_units: [
          {
            custom_id: scanLeadsPaymentReference(userId, quantity),
            description: `${quantity} licencias Scan Leads - IGECO Dashboard`,
            amount: {
              currency_code: SCANLEADS_CURRENCY,
              value: totalPrice.toFixed(2),
            },
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
    } catch (error) {
      setIsCheckoutOpen(false)
      throw error
    }
  }

  const confirmPayment = async (payment: UnconfirmedPayment) => {
    const response = await fetch('/api/scanleads/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        payment_id: payment.paymentId,
        quantity: payment.quantity,
        locale: locale,
      }),
    })

    const responseData = await response.json()

    if (response.status === 200) {
      rememberPayment(null)
      notify(t('success'), 'success')

      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } else if (response.status === 202) {
      notify(t('pending'), 'success')
    } else {
      if (['DECLINED', 'FAILED', 'REFUNDED'].includes(responseData.status)) rememberPayment(null)
      throw new Error(responseData.message || t('error'))
    }
  }

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true)
    try {
      const order = await actions.order.capture()
      const payment = { paymentId: order.id, quantity: checkoutQuantity.current }
      rememberPayment(payment)
      await confirmPayment(payment)
    } catch (error) {
      console.error('Payment error:', error)
      notify(error instanceof Error ? error.message : t('error'), 'error')
    } finally {
      setIsCheckoutOpen(false)
      setIsProcessing(false)
    }
  }

  const onError = (err: any) => {
    console.error('PayPal error:', err)
    notify(t('paymentError'), 'error')
    setIsCheckoutOpen(false)
    setIsProcessing(false)
  }

  const recheckPayment = async () => {
    if (!unconfirmedPayment) return
    setIsProcessing(true)
    try {
      await confirmPayment(unconfirmedPayment)
    } catch (error) {
      notify(error instanceof Error ? error.message : t('error'), 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor={`scanleads-quantity-${userId}`} className="block text-sm font-semibold text-slate-200">
          {t('quantity')}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isProcessing || isCheckoutOpen || Boolean(unconfirmedPayment) || quantity <= 1}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`- ${t('quantity')}`}
          >
            <span aria-hidden="true" className="text-xl leading-none">−</span>
          </button>
          <input
            id={`scanleads-quantity-${userId}`}
            type="number"
            min={1}
            max={SCANLEADS_MAX_QUANTITY}
            step={1}
            value={quantity}
            disabled={isProcessing || isCheckoutOpen || Boolean(unconfirmedPayment)}
            onChange={(event) => setQuantity(Math.min(SCANLEADS_MAX_QUANTITY,
              Math.max(1, Math.trunc(Number(event.target.value) || 1))))}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-lg font-bold text-white outline-none transition focus:border-emerald-400/60 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(SCANLEADS_MAX_QUANTITY, quantity + 1))}
            disabled={isProcessing || isCheckoutOpen || Boolean(unconfirmedPayment) || quantity >= SCANLEADS_MAX_QUANTITY}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`+ ${t('quantity')}`}
          >
            <span aria-hidden="true" className="text-xl leading-none">+</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-200">{t('unitPrice')}</span>
          <span className="font-semibold text-white">${formatPrice(SCANLEADS_MODULE_PRICE_CENTS / 100)} MXN</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="font-bold text-white">{t('total')}</span>
          <span className="text-xl font-bold text-emerald-400">${formatPrice(totalPrice)} MXN</span>
        </div>
      </div>

      {unconfirmedPayment && (
        <div className="space-y-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-950" role="status">
          <p>{t('unconfirmed')}</p>
          <p className="break-all">{t('paymentId')}: {unconfirmedPayment.paymentId}</p>
          <button type="button" onClick={recheckPayment} disabled={isProcessing}
            className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white disabled:opacity-60">
            {t('checkPayment')}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-center text-sm text-blue-200" role="status">
          {t('processing')}
        </div>
      )}

      <div className="rounded-2xl bg-white p-4">
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: SCANLEADS_CURRENCY,
            locale: paypalLocale,
          }}
        >
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={() => setIsCheckoutOpen(false)}
            disabled={isProcessing}
            forceReRender={[paypalLocale, quantity]}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  )
}
