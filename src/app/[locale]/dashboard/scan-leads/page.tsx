import {ScanLeadsClient} from '@/components/scannleads/ScanLeadsClient';
import {Lead} from '@/lib/definitions';
import {fetchRecordsByUserId} from '@/lib/db';

import {getTranslations} from 'next-intl/server';
import {unstable_noStore as noStore} from 'next/cache';
import {redirect} from 'next/navigation';
import { AccountDisable } from '@/components/shared/AccountDisable'
import { getSession, getDashboardSession } from '@/lib/actions/exhibitors';
import { ScanLeadsUpsell } from '@/components/scannleads/ScanLeadsUpsell';

export default async function ScanLeads() {
  noStore();
  const t = await getTranslations('ScanLeadsPage');
  
  const sessionStatus = await getSession();
  const dashboardSession = await getDashboardSession();
  
  if (!dashboardSession) {
    redirect('/');
  }  
  
  if (sessionStatus?.status === 0) {
    return <AccountDisable />;
  }

  // Verificar si el usuario ha comprado el módulo scan-leads
  const hasScanLeadsAccess = sessionStatus?.scanleads_purchased === 1;

  // Si no tiene acceso, mostrar página de venta
  if (!hasScanLeadsAccess) {
    return (
      <ScanLeadsUpsell 
        userId={dashboardSession.id}
        userName={dashboardSession.name}
        userEmail={dashboardSession.email}
      />
    );
  }

  const leads: Lead[] = await fetchRecordsByUserId();
  const totalLeads = leads.length;
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-8xl space-y-8 px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t('panel')}
            </p>
            <div className="flex items-end gap-3">
              <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                {t('badge', {count: totalLeads})}
              </span>
            </div>
            <p className="text-sm text-slate-400">{t('subtitle')}</p>
          </div>          
        </header>
        <div className="">
          <ScanLeadsClient 
            initialLeads={leads}             
          />
        </div>        
        <div />
      </section>
    </main>
  );
}
