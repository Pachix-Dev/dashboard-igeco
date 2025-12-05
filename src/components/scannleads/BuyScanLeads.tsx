'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useLocale } from 'next-intl'
import { useToaster } from '@/context/ToasterContext'
import { createPortal } from 'react-dom'

interface BuyScanLeadsProps {
  userId: number;
}

export function BuyScanLeads({ userId }: BuyScanLeadsProps) {
  
  const locale = useLocale()
  const { notify } = useToaster()
  const [isProcessing, setIsProcessing] = useState(false)

  const modulePrice = 10750 // $10,750 MXN
  
  // Map current locale to PayPal locale format
  const paypalLocale = locale === 'es' ? 'es_MX' : locale === 'en' ? 'en_US' : 'it_IT'
   
  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: 'Módulo Scan Leads - IGECO Dashboard',
          amount: {
            currency_code: 'MXN',
            value: modulePrice.toFixed(2),
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
      
      // Activar módulo en el backend
      const response = await fetch('/api/scanleads/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          payment_id: order.id,
          payment_status: order.status,
          locale: locale,
        }),
      })

      const responseData = await response.json()

      if (response.status === 200) {
        // Pago completado inmediatamente
        notify('¡Módulo activado exitosamente! Redirigiendo...', 'success')
        
        // Recargar la página para mostrar el módulo completo
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else if (response.status === 202) {
        // Pago pendiente de confirmación
        notify('Pago pendiente de confirmación. Te notificaremos por correo cuando se active.', 'success')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        notify(responseData.message || 'Error al activar el módulo', 'error')
      }
    } catch (error) {
      console.error('Payment error:', error)
      notify('Error al procesar el pago', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const onError = (err: any) => {
    console.error('PayPal error:', err)
    notify('Error en el pago. Por favor verifica tu método de pago', 'error')
    setIsProcessing(false)
  }

  return (
    <div className="relative space-y-4 bg-white p-6 rounded-xl border border-white/20 shadow-lg max-w-sm mx-auto">
      {isProcessing && (
        createPortal(
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur-sm">
                <div className="flex flex-col justify-center items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
                    <p className="text-sm font-medium text-white">Procesando pago...</p>
                </div>
            </div>,
            document.body
        )
      )}
      
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
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
            height: 50,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={isProcessing}
          forceReRender={[paypalLocale]}
        />
      </PayPalScriptProvider>      
    </div>
  )
}
