'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AddPonentes } from './AddPonentes.jsx'
import { ListPonentes } from './ListPonentes'
import type { Ponentes } from '@/lib/definitions'
import { useToaster } from '@/context/ToasterContext'

interface PonentesClientProps {
  initialPonentes: Ponentes[]
}

export function PonentesClient({ initialPonentes }: PonentesClientProps) {
  const t = useTranslations('SpeakersPage')
  const { notify } = useToaster()
  const [ponentes, setPonentes] = useState<Ponentes[]>(initialPonentes)
  const [viewStatus, setViewStatus] = useState<'1' | '0'>('1')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setPonentes(initialPonentes)
    setViewStatus('1')
  }, [initialPonentes])

  const loadPonentes = async (status: '1' | '0') => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/ponentes?status=${status}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Error al cargar ponentes')
      }

      setPonentes(Array.isArray(data.ponentes) ? data.ponentes : [])
    } catch (error) {
      console.error('Error loading speakers:', error)
      notify(t('toast.loadError'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewChange = async (status: '1' | '0') => {
    setViewStatus(status)
    await loadPonentes(status)
  }

  const handlePonenteAdded = (newPonente: Ponentes) => {
    if (viewStatus !== '1') {
      return
    }

    setPonentes((prev) => [...prev, newPonente])
  }

  const handlePonenteUpdated = (updatedPonente: Ponentes) => {
    setPonentes((prev) =>
      prev.map((p) =>
        p.uuid === updatedPonente.uuid
          ? { ...p, ...updatedPonente, estatus: updatedPonente.estatus ?? p.estatus }
          : p
      )
    )
  }

  const handleToggleStatus = async (ponente: Ponentes) => {
    const nextStatus = ponente.estatus === 1 ? 0 : 1

    try {
      const response = await fetch(`/api/ponentes/${ponente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatus: nextStatus }),
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado')
      }

      notify(
        nextStatus === 1 ? t('toast.activated') : t('toast.deactivated'),
        'success'
      )

      if (viewStatus === '1' && nextStatus === 0) {
        setPonentes((prev) => prev.filter((item) => item.id !== ponente.id))
        return
      }

      if (viewStatus === '0' && nextStatus === 1) {
        setPonentes((prev) => prev.filter((item) => item.id !== ponente.id))
        return
      }

      setPonentes((prev) =>
        prev.map((item) =>
          item.id === ponente.id ? { ...item, estatus: nextStatus } : item
        )
      )
    } catch (error) {
      console.error('Error updating speaker status:', error)
      notify(t('toast.statusError'), 'error')
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/ponentes/export')

      if (!response.ok) {
        throw new Error('No se pudo exportar el archivo')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'ponentes-activos.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      notify(t('export.success'), 'success')
    } catch (error) {
      console.error('Error exporting speakers:', error)
      notify(t('export.error'), 'error')
    }
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
                {viewStatus === '1'
                  ? t('badgeActive', { count: totalSpeakers })
                  : t('badgeInactive', { count: totalSpeakers })}
              </span>
            </div>
            <p className="text-sm text-slate-400">{t('subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => handleViewChange('1')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${viewStatus === '1' ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {t('view.active')}
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('0')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${viewStatus === '0' ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {t('view.inactive')}
              </button>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
            >
              {t('export.cta')}
            </button>

            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-blue-500/10 sm:flex">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/15 text-lg font-semibold text-blue-200">
                {totalSpeakers}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {t('stat.label')}
                </p>
                <p className="text-sm font-semibold text-white">
                  {viewStatus === '1' ? t('stat.activeDesc') : t('stat.inactiveDesc')}
                </p>
              </div>
            </div>
            <AddPonentes onPonenteAdded={handlePonenteAdded} />
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur">
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center text-sm text-slate-400">
              {t('loading')}
            </div>
          ) : (
            <ListPonentes
              key={viewStatus}
              ponente={ponentes}
              onPonenteUpdated={handlePonenteUpdated}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      </section>
    </main>
  )
}
