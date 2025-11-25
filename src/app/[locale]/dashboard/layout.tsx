import {Menu} from 'app/components/shared/Menu';
import {setRequestLocale} from 'next-intl/server';
import type {ReactNode} from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export default async function DashboardLayout({children, params}: DashboardLayoutProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  
  return (
    <section className="relative min-h-screen bg-slate-950 text-slate-50 lg:flex">
      <Menu />
      <main className="w-full flex-1">
        <div className="mx-auto ">{children}</div>
      </main>
    </section>
  );
}
