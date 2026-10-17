import { getDashboardSession } from '@/lib/actions/exhibitors';
import { redirect } from 'next/navigation';
import { getDocumentComplianceSnapshot } from '@/lib/document-compliance';
import { getTranslations } from 'next-intl/server';
import { AccountReactivationPayment } from '@/components/shared/AccountReactivationPayment';
import { resolveDocumentPenaltyState } from '@/lib/document-compliance';

export const dynamic = 'force-dynamic';

export default async function ReactivationPaymentPage() {
  const session = await getDashboardSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'exhibitor' && session.role !== 'exhibitorplus') {
    redirect('/dashboard');
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

  if (!penaltyState.shouldShowPayment) {
    redirect('/dashboard');
  }

  const snapshot = await getDocumentComplianceSnapshot(session.id);
  const t = await getTranslations();
  const missingDocuments = snapshot.missingDocuments.map((doc) => t(doc.titleKey));

  return <AccountReactivationPayment userId={session.id} missingDocuments={missingDocuments} />;
}
