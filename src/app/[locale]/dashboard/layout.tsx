import {Menu} from '@/components/shared/Menu';
import type {ReactNode} from 'react';

// Forzar renderizado dinámico (requiere autenticación)
export const dynamic = 'force-dynamic';

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export default async function DashboardLayout({children, params}: DashboardLayoutProps) {    
  return (
    <section className="relative min-h-screen bg-slate-950 text-slate-50 lg:flex">
      <Menu />
      <main className="w-full flex-1">
        <div className="mx-auto ">{children}</div>
      </main>
    </section>
  );
}
