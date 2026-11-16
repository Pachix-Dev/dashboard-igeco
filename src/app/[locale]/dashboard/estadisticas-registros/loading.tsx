import { getTranslations } from 'next-intl/server';
import { RegistrationStatsSkeleton } from '@/components/registration-stats/RegistrationStatsSkeleton';

export default async function RegistrationStatsLoading() {
  const t = await getTranslations('RegistrationStatsPage');

  return <RegistrationStatsSkeleton label={t('loading')} />;
}
