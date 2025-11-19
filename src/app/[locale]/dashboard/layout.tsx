import { Menu } from "app/components/shared/Menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <section className="grid lg:flex">
      <Menu />  
      <main className="w-full p-4">
        {children}
      </main>
    </section>
  )
}
