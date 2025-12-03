import { getTranslations } from 'next-intl/server'
import { ProgramaClient } from '@/components/programa/ProgramaClient'
import { fetchProgramaEscenarios, fetchProgramaDias } from '@/lib/db'
import { unstable_noStore as noStore } from 'next/cache'

export default async function ProgramaPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ProgramaPage' })
  const [escenarios, dias] = await Promise.all([
    fetchProgramaEscenarios().catch(() => []),
    fetchProgramaDias().catch(() => [])
  ])

  return (
    <section className='mx-auto space-y-8 px-6 py-10'>
      <ProgramaClient initialEscenarios={escenarios} initialDias={dias} />
    </section>
  )
}
