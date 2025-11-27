import { getTranslations } from 'next-intl/server'
import { ProgramaClient } from '@/components/programa/ProgramaClient'

export default async function ProgramaPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ProgramaPage' })

  return (
    <section className='container mx-auto w-full max-w-7xl space-y-6 px-4 py-6'>
      <ProgramaClient />
    </section>
  )
}
