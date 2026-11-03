'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BuyScanLeads } from './BuyScanLeads';

export function ScanLeadsLicenses({ userId, paidLicenses, totalPaid }: {
  userId: number;
  paidLicenses: number;
  totalPaid: number;
}) {
  const t = useTranslations('ScanLeadsPurchase');
  const [showPurchase, setShowPurchase] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-400/20 bg-white/5 p-4 sm:p-5">
      <div className="flex flex-col gap-4 ">
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-semibold text-emerald-300">{t('paidLicenses')}: {paidLicenses}</p>
          <p className="text-base sm:text-xl text-slate-300">{t('totalPaid')}: ${new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 2, maximumFractionDigits: 2,
          }).format(totalPaid)} MXN</p>
        </div>
        <button type="button" aria-expanded={showPurchase} onClick={() => setShowPurchase(!showPurchase)}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-emerald-600 sm:w-auto sm:text-lg">
          {showPurchase ? (
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          )}
          {showPurchase ? t('closePurchase') : t('buyMore')}
        </button>
      </div>
      {paidLicenses === 0 && <p className="text-xs text-slate-400">{t('noRecordedPurchases')}</p>}
      {showPurchase && <BuyScanLeads userId={userId} />}
    </div>
  );
}
