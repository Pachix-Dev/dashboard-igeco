'use client';

import {AddUser} from '@/components/users/AddUser';
import {ListUsers} from '@/components/users/ListUsers';
import {PageLoading} from '@/components/shared/PageLoading';
import {useTranslations} from 'next-intl';
import {useState, useEffect} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  maxsessions: number;
  maxexhibitors: number;
  event: string;
  company: string;
}

export default function Usuarios() {
  const t = useTranslations('UsersPage');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        const excludedRoles = ['admin'];
        const filteredData = Array.isArray(data)
          ? data.filter((user: User) => !excludedRoles.includes(user.role))
          : [];                  
        setUsers(filteredData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAdded = (newUser: User) => {    
    setUsers(prevUsers => [newUser, ...prevUsers]);    
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ).filter(user => user.role !== 'admin') // Remover si cambió a admin
    );
  };

  const totalUsers = users.length;

  if (isLoading) {
    return <PageLoading message={t('loading')} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-8xl space-y-8 px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t('panel')}
            </p>
            <div className="flex items-end gap-3">
              <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                {t('badge', {count: totalUsers})}
              </span>
            </div>
            <p className="text-sm text-slate-400">{t('subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-blue-500/10 sm:flex">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/15 text-lg font-semibold text-blue-200">
                {totalUsers}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {t('stat.label')}
                </p>
                <p className="text-sm font-semibold text-white">{t('stat.desc')}</p>
              </div>
            </div>
            <AddUser onUserAdded={handleUserAdded} />
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur">
          <ListUsers users={users} onUserUpdated={handleUserUpdated} />
        </div>
      </section>
    </main>
  );
}
