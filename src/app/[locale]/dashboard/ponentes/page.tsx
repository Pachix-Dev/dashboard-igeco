import {PonentesClient} from 'app/components/ponente/PonentesClient';
import type {Ponentes} from 'app/lib/definitions';
import {fetchPonenetes} from 'app/lib/db';
import {unstable_noStore as noStore} from 'next/cache';

export default async function Ponentes() {
  noStore();
  const ponente: Ponentes[] = await fetchPonenetes();

  return <PonentesClient initialPonentes={ponente} />;
}
