import {Menu} from 'app/components/shared/Menu';
import type {ReactNode} from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <section className="relative min-h-screen bg-slate-950 text-slate-50 lg:flex">
      <Menu />
      <main className="w-full flex-1 px-4  lg:px-8 xl:px-12">
        <div className="mx-auto max-w-9xl">{children}</div>
      </main>
    </section>
  );
}
