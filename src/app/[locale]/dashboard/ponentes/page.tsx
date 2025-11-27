import {PonentesClient} from '@/components/ponente/PonentesClient';
import type {Ponentes} from '@/lib/definitions';
import {fetchPonenetes} from '@/lib/db';
import {unstable_noStore as noStore} from 'next/cache';

export default async function Ponentes() {
  noStore();
  const ponente: Ponentes[] = await fetchPonenetes();

  return <PonentesClient initialPonentes={ponente} />;
}
