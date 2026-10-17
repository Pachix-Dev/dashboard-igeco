import { getDashboardSession } from '@/lib/actions/exhibitors';
import { redirect } from 'next/navigation';
import { RequirementsModule } from '@/components/requirements/RequirementsModule';
import { resolveDocumentPenaltyState } from '@/lib/document-compliance';

export const dynamic = 'force-dynamic';

export default async function RequirementsPage() {
  const session = await getDashboardSession();

  if (!session) {
    redirect('/');
  }

  if (session.status !== 1) {
    redirect('/dashboard');
  }

  const penaltyState = resolveDocumentPenaltyState({
    required: session.document_penalty_required === 1,
    paid: session.document_penalty_paid === 1,
    waived: session.document_penalty_waived === 1,
    lockedByAdmin: session.document_penalty_locked_by_admin === 1
  });

  if (penaltyState.shouldShowPayment) {
    redirect('/dashboard/reactivation-payment');
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
