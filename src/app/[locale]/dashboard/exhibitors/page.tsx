import ExhibitorRegistrationClosed from '@/components/exhibitors/ExhibitorRegistrationClosed';
import { ExhibitorsClient } from '@/components/exhibitors/ExhibitorsClient';
import { getSession, getExhibitors, getExhibitorStats } from '@/lib/actions/exhibitors';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Exhibitors() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const stats = await getExhibitorStats(session.id);
  
  if (session.role === "exhibitor" || session.role === "exhibitorplus") {
    return <ExhibitorRegistrationClosed stats={stats} />;
  }

  const exhibitors = await getExhibitors(session.id, session.role);

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
