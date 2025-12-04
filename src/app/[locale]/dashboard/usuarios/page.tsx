import {UsersClient} from '@/components/users/UsersClient';
import {getDashboardUsers} from '@/lib/actions/users';
import {getTranslations} from 'next-intl/server';

export default async function Usuarios() {
  const t = await getTranslations('UsersPage');
  const users = await getDashboardUsers();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <UsersClient
        initialUsers={users}
        header={{
          panel: t('panel'),
          title: t('title'),
          subtitle: t('subtitle'),
        }}
      />
    </main>
  );
}
