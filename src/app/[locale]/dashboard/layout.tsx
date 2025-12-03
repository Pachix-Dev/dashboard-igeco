import {Menu} from '@/components/shared/Menu';
import type {ReactNode} from 'react';

// Forzar renderizado dinámico (requiere autenticación)
export const dynamic = 'force-dynamic';

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export default async function DashboardLayout({children, params}: DashboardLayoutProps) {
  const {locale} = await params;
  // Actualiza last_activity de la sesión activa en cada request del dashboard
  // Llamada en el servidor para evitar Edge restrictions en middleware
  try {
    // Import dinámico de fetch en server context
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/active-sessions/update`, {
      method: 'POST',
      // Las cookies se envían automáticamente en server-side fetch
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // Ignorar errores no críticos
    void res;
  } catch (_) {}
  
  return (
    <section className="relative min-h-screen bg-slate-950 text-slate-50 lg:flex">
      <Menu />
      <main className="w-full flex-1">
        <div className="mx-auto ">{children}</div>
      </main>
    </section>
  );
}
