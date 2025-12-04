import {ScanLeadsClient} from '@/components/scannleads/ScanLeadsClient';
import {Lead} from '@/lib/definitions';
import {fetchRecordsByUserId} from '@/lib/db';
import {getUserSessions} from '@/lib/actions/sessions';
import {getTranslations} from 'next-intl/server';
import {unstable_noStore as noStore} from 'next/cache';
import {redirect} from 'next/navigation';
import { AccountDisable } from '@/components/shared/AccountDisable'
import { getSession } from '@/lib/actions/exhibitors';

export default async function ScanLeads() {
  
  noStore();
  const t = await getTranslations('ScanLeadsPage');
  
  // Verificar sesiones del usuario
  const sessionData = await getUserSessions();
  const sessionStatus = await getSession();
  
  if (!sessionData) {
    redirect('/');
  }

  const {sessions, maxSessions} = sessionData;
  const activeSessions = sessions.length;

  const leads: Lead[] = await fetchRecordsByUserId();
  const totalLeads = leads.length;
  
  if (sessionStatus?.status === 0) {
    return <AccountDisable />;
  }
  
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
