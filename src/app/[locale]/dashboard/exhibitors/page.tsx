import {ExhibitorsClient} from 'app/components/exhibitors/ExhibitorsClient';
import {Exhibitor} from 'app/lib/definitions';
import {fetchExhibitors} from 'app/lib/db';
import {unstable_noStore as noStore} from 'next/cache';

export default async function Exhibitors() {
  noStore();
  const exhibitors: Exhibitor[] = await fetchExhibitors();

  return <ExhibitorsClient initialExhibitors={exhibitors} />;
}
