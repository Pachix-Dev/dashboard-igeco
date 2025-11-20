import {getTranslations} from 'next-intl/server';
import {AddEscenario} from 'app/components/programa/AddEscenario';
import {Adddias} from 'app/components/programa/Adddias';
import {SelectRelacion} from 'app/components/programa/SelectRelacion';
import {fetchEscenarios, fetchDias} from 'app/lib/db';

export default async function Escenarios({
  params
}: {
  params: {locale: string};
}) {
  const {locale} = params;
  const t = await getTranslations({locale, namespace: 'Exhibitors'});

  const escenarios = await fetchEscenarios();
  const dias = await fetchDias();

  return (
    <section className="container mx-auto grid w-full max-w-full gap-10 md:max-w-5xl">
      <div className="flex items-center justify-between gap-20">
        <h1 className="text-center text-2xl font-extrabold">{t('heading')}</h1>
      </div>
      <AddEscenario />
      <Adddias />
      <SelectRelacion escenarios={escenarios} dias={dias} />
    </section>
  );
}
