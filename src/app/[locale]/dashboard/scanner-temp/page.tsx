import {ScanLeadsClientTemp} from '@/components/scannleads/ScanLeadsClientTemp';

import {unstable_noStore as noStore} from 'next/cache';
import {redirect} from 'next/navigation';
import { getSession, getDashboardSession } from '@/lib/actions/exhibitors';
import { ScanLeadsUpsell } from '@/components/scannleads/ScanLeadsUpsell';
import { ScanLeadsLicenses } from '@/components/scannleads/ScanLeadsLicenses';
import { getScanLeadsPurchaseSummary } from '@/lib/scanleads-payments';

export default async function ScanLeads() {
  noStore();
  
  const sessionStatus = await getSession();
  const dashboardSession = await getDashboardSession();
  
  // Verificar si el usuario tiene sesión activa
  if (!dashboardSession) {
    redirect('/');
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

  const purchaseSummary = await getScanLeadsPurchaseSummary(dashboardSession.id);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-8xl space-y-8 px-6 py-10">
        <ScanLeadsLicenses userId={dashboardSession.id} {...purchaseSummary} />
        <div className="">
          <ScanLeadsClientTemp />
        </div>        
        <div />
      </section>
    </main>
  );
}
