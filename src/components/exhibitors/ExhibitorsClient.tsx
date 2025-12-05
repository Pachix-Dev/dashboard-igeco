'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AddExhibitor } from './AddExhibitor'
import { BuyExhibitors } from './BuyExhibitors'
import { ListExhibitors } from './ListExhibitors'
import ExhibitorStats from './ExhibitorStats'
import type { Exhibitor } from '@/lib/definitions'
import { AccountDisable } from '@/components/shared/AccountDisable'

interface ExhibitorsClientProps {
  initialExhibitors: Exhibitor[]
  userId: number
  role: string
  status: number
  maxExhibitors: number
  stats: {
    total: number
    maxExhibitors: number
    remaining: number
    usagePercentage: number
  }
}

export function ExhibitorsClient({ 
  initialExhibitors, 
  userId, 
  role, 
  status, 
  maxExhibitors,
  stats
}: ExhibitorsClientProps) {
  const t = useTranslations('ExhibitorsPage')
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>(initialExhibitors)

  const handleExhibitorAdded = (newExhibitor: Exhibitor) => {
    setExhibitors((prev) => [...prev, newExhibitor])
  }

  const handleExhibitorUpdated = (updatedExhibitor: Exhibitor) => {
    setExhibitors((prev) =>
      prev.map((e) => (e.id === updatedExhibitor.id ? updatedExhibitor : e))
    )
  }

  const handlePurchaseComplete = () => {
    // Recargar la página para actualizar el límite desde el servidor
    window.location.reload()
  }

  const totalExhibitors = exhibitors.length

  if(status === 0){
    return (
      <AccountDisable />
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-8xl space-y-8 px-6 py-10">
        <header className="flex flex-col gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t('panel')}
            </p>
            <div className="flex items-end gap-3">
              <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 text-center">
                {t('badge', {count: totalExhibitors})}
              </span>
            </div>
            <p className="text-sm text-slate-400">{t('subtitle')}</p>
          </div>

          {/* Stats Grid */}
          <ExhibitorStats 
            total={totalExhibitors}
            maxExhibitors={maxExhibitors}
            remaining={stats.remaining}
            usagePercentage={(totalExhibitors / maxExhibitors) * 100}
            translations={{
              registered: t('stats.registered'),
              limit: t('stats.limit'),
              remaining: t('stats.remaining'),
              usage: t('stats.usage'),
            }}
          />

          {/* Action buttons */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-end gap-3">
            <BuyExhibitors
              userId={userId}
              currentTotal={totalExhibitors}
              maxExhibitors={maxExhibitors}
              onPurchaseComplete={handlePurchaseComplete}
            />
            <AddExhibitor 
              userId={userId}
              onExhibitorAdded={handleExhibitorAdded}
              maxExhibitors={maxExhibitors}
              currentTotal={totalExhibitors}
            />
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur">
          <ListExhibitors 
            exhibitors={exhibitors} 
            userId={userId}
            role={role}
            onExhibitorUpdated={handleExhibitorUpdated} 
          />
        </div>
      </section>
    </main>
  )
}
