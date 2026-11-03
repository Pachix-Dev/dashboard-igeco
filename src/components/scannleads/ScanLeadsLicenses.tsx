'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BuyScanLeads } from './BuyScanLeads';

export function ScanLeadsLicenses({ userId, paidLicenses, totalPaid }: {
  userId: number;
  paidLicenses: number;
  totalPaid: number;
}) {
  const t = useTranslations('ScanLeadsPurchase');
  const locale = useLocale();
  const [showPurchase, setShowPurchase] = useState(false);

  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-white/5 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-300">{t('paidLicenses')}: {paidLicenses}</p>
          <p className="text-sm text-slate-300">{t('totalPaid')}: {new Intl.NumberFormat(locale, {
            style: 'currency', currency: 'MXN',
          }).format(totalPaid)} MXN</p>
        </div>
        <button type="button" aria-expanded={showPurchase} onClick={() => setShowPurchase(!showPurchase)}
          className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600">
          {showPurchase ? t('closePurchase') : t('buyMore')}
        </button>
      </div>
      {paidLicenses === 0 && <p className="text-xs text-slate-400">{t('noRecordedPurchases')}</p>}
      {showPurchase && <BuyScanLeads userId={userId} />}
    </div>
  );
}
