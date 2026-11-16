import { RegistrationStatsModule } from '@/components/registration-stats/RegistrationStatsModule';
import { redirect } from '@/i18n/routing';
import { getSession } from '@/lib/actions/exhibitors';

export const dynamic = 'force-dynamic';

export default async function RegistrationStatsPage() {
  const session = await getSession();

  if (!session) {
    return redirect('/');
  }

  if (session.role !== 'admin' || session.status !== 1) {
    return redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <RegistrationStatsModule />
    </main>
  );
}
