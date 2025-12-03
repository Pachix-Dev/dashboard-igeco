import { ExhibitorsClient } from '@/components/exhibitors/ExhibitorsClient';
import { getSession, getExhibitors, getExhibitorStats } from '@/lib/actions/exhibitors';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Exhibitors() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const exhibitors = await getExhibitors(session.id);
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
