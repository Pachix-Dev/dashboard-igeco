'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AddPonentes } from './AddPonentes.jsx'
import { ListPonentes } from './ListPonentes'
import type { Ponentes } from '@/lib/definitions'

interface PonentesClientProps {
  initialPonentes: Ponentes[]
}

export function PonentesClient({ initialPonentes }: PonentesClientProps) {
  const t = useTranslations('SpeakersPage')
  const [ponentes, setPonentes] = useState<Ponentes[]>(initialPonentes)

  const handlePonenteAdded = (newPonente: Ponentes) => {
    setPonentes((prev) => [...prev, newPonente])
  }

  const handlePonenteUpdated = (updatedPonente: Ponentes) => {
    setPonentes((prev) =>
      prev.map((p) => (p.uuid === updatedPonente.uuid ? updatedPonente : p))
    )
  }

  const totalSpeakers = ponentes.length

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto space-y-8 px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t('panel')}
            </p>
            <div className="flex items-end gap-3">
              <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                {t('badge', { count: totalSpeakers })}
              </span>
            </div>
            <p className="text-sm text-slate-400">{t('subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-blue-500/10 sm:flex">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/15 text-lg font-semibold text-blue-200">
                {totalSpeakers}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {t('stat.label')}
                </p>
                <p className="text-sm font-semibold text-white">
                  {t('stat.desc')}
                </p>
              </div>
            </div>
            <AddPonentes onPonenteAdded={handlePonenteAdded} />
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur">
          <ListPonentes ponente={ponentes} onPonenteUpdated={handlePonenteUpdated} />
        </div>
      </section>
    </main>
  )
}
