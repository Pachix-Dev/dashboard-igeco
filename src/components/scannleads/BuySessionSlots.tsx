'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { recordSessionPayment } from '@/lib/actions/sessions';
import { useToaster } from '@/context/ToasterContext';
import { createPortal } from 'react-dom';

const SLOT_PRICE = 100; // Precio en MXN por slot

interface BuySessionSlotsProps {
  currentSlots: number;
  onPurchaseComplete?: () => void;
}

export function BuySessionSlots({ currentSlots, onPurchaseComplete }: BuySessionSlotsProps) {
  const t = useTranslations('BuySessionSlots');
  const { notify } = useToaster();
  const [showModal, setShowModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const totalPrice = selectedSlots * SLOT_PRICE;

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!isPurchasing) {
      setShowModal(false);
      setSelectedSlots(1);
    }
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `${selectedSlots} slot(s) de sesión adicional(es)`,
          amount: {
            currency_code: 'MXN',
            value: totalPrice.toString(),
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    setIsPurchasing(true);
    try {
      const order = await actions.order.capture();
      
      const result = await recordSessionPayment({
        paymentId: order.id,
        amountSlots: selectedSlots,
        amountPaid: totalPrice,
        currency: 'MXN',
        paymentStatus: order.status,
      });

      if (result.success) {
        notify(t('purchaseSuccess', { slots: selectedSlots }), 'success');
        onPurchaseComplete?.();
        handleCloseModal();
      } else {
        notify(result.error || t('purchaseError'), 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      notify(t('purchaseError'), 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    notify(t('purchaseError'), 'error');
    setIsPurchasing(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition hover:scale-[1.02]'
      >
        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
        </svg>
        {t('buySlots')}
      </button>

      {/* Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/60 p-4 backdrop-blur-sm'>
          <div className='relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl'>
            <div className='mb-6 flex items-start justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-white'>{t('title')}</h2>
                <p className='mt-1 text-sm text-slate-400'>{t('subtitle')}</p>
              </div>
              {!isPurchasing && (
                <button
                  onClick={handleCloseModal}
                  className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
                >
                  ✕
                </button>
              )}
            </div>

            <div className='space-y-6'>
              {/* Info actual */}
              <div className='rounded-xl border border-blue-500/30 bg-blue-500/10 p-4'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-blue-500/20 p-3'>
                    <svg className='h-6 w-6 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm text-blue-200'>{t('currentSlots')}</p>
                    <p className='text-2xl font-bold text-white'>{currentSlots} slots</p>
                  </div>
                </div>
              </div>

              {/* Selector de slots */}
              <div className='space-y-3'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('selectSlots')}
                </label>
                <div className='grid grid-cols-4 gap-3'>
                  {[1, 2, 5, 10].map((slots) => (
                    <button
                      key={slots}
                      onClick={() => setSelectedSlots(slots)}
                      disabled={isPurchasing}
                      className={`rounded-xl border p-4 text-center transition ${
                        selectedSlots === slots
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      } disabled:opacity-50`}
                    >
                      <p className='text-2xl font-bold text-white'>{slots}</p>
                      <p className='mt-1 text-xs text-slate-400'>
                        ${slots * SLOT_PRICE} MXN
                      </p>
                    </button>
                  ))}
                </div>

                <div className='flex items-center gap-3'>
                  <input
                    type='number'
                    min='1'
                    max='100'
                    value={selectedSlots}
                    onChange={(e) => setSelectedSlots(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    disabled={isPurchasing}
                    className='flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none disabled:opacity-50'
                    placeholder={t('customAmount')}
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className='rounded-xl border border-white/10 bg-white/5 p-6'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-slate-400'>{t('slotsToAdd')}</span>
                    <span className='font-semibold text-white'>{selectedSlots}</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-slate-400'>{t('pricePerSlot')}</span>
                    <span className='font-semibold text-white'>${SLOT_PRICE} MXN</span>
                  </div>
                  <div className='border-t border-white/10 pt-3'>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-slate-200'>{t('total')}</span>
                      <span className='text-2xl font-bold text-white'>${totalPrice} MXN</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between border-t border-white/10 pt-3 text-sm'>
                    <span className='text-slate-400'>{t('newTotal')}</span>
                    <span className='text-lg font-bold text-green-400'>
                      {currentSlots + selectedSlots} slots
                    </span>
                  </div>
                </div>
              </div>

              {/* PayPal Buttons */}
              {!isPurchasing && (
                <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                      currency: 'MXN',
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: 'vertical', label: 'pay' }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                      disabled={isPurchasing}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {isPurchasing && (
                <div className='flex items-center justify-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-6'>
                  <div className='h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-blue-500' />
                  <p className='text-sm font-semibold text-blue-200'>{t('processing')}</p>
                </div>
              )}

              {/* Info adicional */}
              <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
                <div className='flex items-start gap-3'>
                  <svg className='h-5 w-5 flex-shrink-0 text-slate-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                  </svg>
                  <div>
                    <p className='text-sm font-semibold text-slate-200'>{t('securePayment')}</p>
                    <p className='mt-1 text-xs text-slate-400'>{t('securePaymentDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
