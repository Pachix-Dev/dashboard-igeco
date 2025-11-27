import {ExhibitorsClient} from '@/components/exhibitors/ExhibitorsClient';
import {Exhibitor} from '@/lib/definitions';
import {fetchExhibitors} from '@/lib/db';
import {unstable_noStore as noStore} from 'next/cache';

export default async function Exhibitors() {
  noStore();
  const exhibitors: Exhibitor[] = await fetchExhibitors();

  return <ExhibitorsClient initialExhibitors={exhibitors} />;
}
