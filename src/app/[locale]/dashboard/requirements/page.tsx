import { getDashboardSession } from '@/lib/actions/exhibitors';
import { AccountDisable } from '@/components/shared/AccountDisable';
import { redirect } from 'next/navigation';
import { RequirementsModule } from '@/components/requirements/RequirementsModule';

export const dynamic = 'force-dynamic';

export default async function RequirementsPage() {
  const session = await getDashboardSession();

  if (!session) {
    redirect('/');
  }

  if (session.status === 0) {
    return <AccountDisable />;
  }

  if (session.role !== 'exhibitor' && session.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <RequirementsModule role={session.role} userName={session.name} />
      </section>
    </main>
  );
}
