export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <section className="flex">
      {children}
    </section>
  )
}
