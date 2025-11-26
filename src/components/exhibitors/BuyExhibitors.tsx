'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useTranslations, useLocale } from 'next-intl'
import { useToaster } from 'app/context/ToasterContext'
import { useSessionUser } from 'app/store/session-user'

interface BuyExhibitorsProps {
  currentTotal: number
  maxExhibitors: number
  onPurchaseComplete: () => void
}

export function BuyExhibitors({ currentTotal, maxExhibitors, onPurchaseComplete }: BuyExhibitorsProps) {
  const t = useTranslations('ExhibitorsPage.buy')
  const locale = useLocale()
  const { notify } = useToaster()
  const { userSession, updateMaxExhibitors } = useSessionUser()
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const pricePerExhibitor = 300 // $300 MXN por expositor
  const totalPrice = (quantity * pricePerExhibitor).toFixed(2)
  const formattedPrice = (quantity * pricePerExhibitor).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Map current locale to PayPal locale format
  const paypalLocale = locale === 'es' ? 'es_MX' : locale === 'en' ? 'en_US' : 'it_IT'

  const isLimitReached = currentTotal >= maxExhibitors
  const hasNoPermission = maxExhibitors === 0

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    if (!isProcessing) {
      setIsOpen(false)
      setQuantity(1)
    }
  }

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `${quantity} Exhibitor slots for IGECO`,
          amount: {
            currency_code: 'MXN',
            value: totalPrice,
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    })
  }

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true)
    try {
      const order = await actions.order.capture()
      
      // Actualizar límite de expositores en el backend
      const response = await fetch('/api/exhibitors/increase-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userSession?.id,
          additional_slots: quantity,
          payment_id: order.id,
          payment_status: order.status,
          locale: locale, // Enviar el idioma actual
        }),
      })

      const responseData = await response.json()

      if (response.status === 200) {
        // Pago completado inmediatamente
        const newLimit = responseData.new_limit
        
        // Actualizar el store de Zustand con el nuevo límite
        updateMaxExhibitors(newLimit)
        
        notify(t('success', { quantity }), 'success')
        handleClose()
        
        // Recargar la página para refrescar la lista de expositores
        onPurchaseComplete()
      } else if (response.status === 202) {
        // Pago pendiente de confirmación
        notify(`${t('pending')}: ${t('pendingMessage')}`, 'success')
        handleClose()
        // No recargar la página, el límite se aplicará cuando el webhook confirme
      } else {
        notify(responseData.message || t('error'), 'error')
      }
    } catch (error) {
      console.error('Payment error:', error)
      notify(t('error'), 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const onError = (err: any) => {
    console.error('PayPal error:', err)
    notify(t('paymentError'), 'error')
    setIsProcessing(false)
  }

  // No mostrar el botón si no tiene permiso
  if (hasNoPermission) {
    return null
  }

  return (
    <>
      {/* Botón para abrir modal - solo se muestra si llegó al límite */}
      {isLimitReached && (
        <button
          onClick={handleOpen}
          className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:ring-offset-2 focus:ring-offset-slate-950'
        >
          <span className='grid h-6 w-6 place-items-center rounded-lg bg-white/20 text-xs font-bold'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </span>
          <span>{t('button')}</span>
        </button>
      )}

      {/* Modal de compra */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition px-4 py-8'>
          <div className='w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-500/20'>
            {/* Header */}
            <div className='mb-6 flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-2xl font-bold text-white'>{t('title')}</h2>
                <p className='text-sm text-slate-300'>{t('subtitle')}</p>
              </div>
              <button
                type='button'
                onClick={handleClose}
                disabled={isProcessing}
                className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('close')}
              </button>
            </div>

            {/* Información actual */}
            <div className='mb-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-300'>{t('current')}</span>
                <span className='font-semibold text-white'>{currentTotal} / {maxExhibitors}</span>
              </div>
              <div className='h-2 rounded-full bg-slate-700/50 overflow-hidden'>
                <div 
                  className='h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500'
                  style={{ width: `${Math.min((currentTotal / maxExhibitors) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Selector de cantidad */}
            <div className='mb-6 space-y-3'>
              <label className='block text-sm font-semibold text-slate-200'>
                {t('quantity')}
              </label>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isProcessing || quantity <= 1}
                  className='rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  disabled={isProcessing}
                  min='1'
                  max='50'
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center text-lg font-bold text-white ring-0 transition focus:border-emerald-400/60 focus:outline-none disabled:opacity-50'
                />

                <button
                  type='button'
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  disabled={isProcessing || quantity >= 50}
                  className='rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <p className='text-xs text-slate-400'>{t('maxQuantity')}</p>
            </div>

            {/* Resumen de precio */}
            <div className='mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-slate-200'>{t('pricePerSlot')}</span>
                  <span className='font-semibold text-white'>${pricePerExhibitor} MXN</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-slate-200'>{t('slots')}</span>
                  <span className='font-semibold text-white'>{quantity}</span>
                </div>
                <div className='border-t border-white/10 pt-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-lg font-bold text-white'>{t('total')}</span>
                    <span className='text-2xl font-bold text-emerald-400'>${formattedPrice} MXN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de PayPal */}
            <div className='space-y-3'>
              {isProcessing && (
                <div className='rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-center text-sm text-blue-200'>
                  {t('processing')}
                </div>
              )}

              <div className='rounded-2xl bg-white p-4'>
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                    currency: 'MXN',
                    locale: paypalLocale,
                  }}
                >
                  <PayPalButtons
                    style={{ 
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'pay',
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    disabled={isProcessing}
                  />
                </PayPalScriptProvider>
              </div>

              <button
                type='button'
                onClick={handleClose}
                disabled={isProcessing}
                className='w-full rounded-xl border border-white/10 bg-white/0 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
