import { ExhibitorsClient } from '@/components/exhibitors/ExhibitorsClient';
import { getSession, getExhibitors, getExhibitorStats } from '@/lib/actions/exhibitors';
import { redirect } from 'next/navigation';
import { AccountDisable } from '@/components/shared/AccountDisable'

export const dynamic = 'force-dynamic';

export default async function Exhibitors() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }
  if (session.status === 0) {
    return <AccountDisable />;
  }

  const exhibitors = await getExhibitors(session.id, session.role);
  const stats = await getExhibitorStats(session.id);

  return (
    <ExhibitorsClient
      initialExhibitors={exhibitors}
      userId={session.id}
      role={session.role}
      status={session.status}
      maxExhibitors={stats.maxExhibitors}
      stats={stats}
    />
  );
}
