'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { Escenario } from '@/types/programa'

interface Props {
  escenarios: Escenario[]
}

export function VistaCompleta({ escenarios }: Props) {
  const t = useTranslations('ProgramaPage.vista')
  const [programaCompleto, setProgramaCompleto] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProgramaCompleto()
  }, [])

  const loadProgramaCompleto = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/programa/completo')
      const data = await response.json()
      if (response.ok) {
        setProgramaCompleto(data.data || [])
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500'></div>
          <p className='mt-4 text-sm text-slate-400'>{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header con Estadísticas */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6'>
          <div className='text-3xl font-bold text-blue-400'>{stats.total_escenarios || 0}</div>
          <div className='mt-1 text-sm text-slate-400'>{t('stats.escenarios')}</div>
        </div>
        <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6'>
          <div className='text-3xl font-bold text-purple-400'>{stats.total_dias || 0}</div>
          <div className='mt-1 text-sm text-slate-400'>{t('stats.dias')}</div>
        </div>
        <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6'>
          <div className='text-3xl font-bold text-amber-400'>{stats.total_conferencias || 0}</div>
          <div className='mt-1 text-sm text-slate-400'>{t('stats.conferencias')}</div>
        </div>
        <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6'>
          <div className='text-3xl font-bold text-emerald-400'>{stats.total_ponentes || 0}</div>
          <div className='mt-1 text-sm text-slate-400'>{t('stats.ponentes')}</div>
        </div>
      </div>

      {/* Programa por Escenarios */}
      {programaCompleto.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-white/20 p-12 text-center'>
          <p className='text-slate-400'>{t('noData')}</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {programaCompleto.map((escenario) => (
            <div
              key={escenario.id}
              className='rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-xl'
            >
              {/* Header del Escenario */}
              <div className='mb-6 grid md:flex gap-2 items-center justify-between border-b border-white/10 pb-4'>
                <div>
                  <h2 className='text-2xl font-bold text-white'>{escenario.name}</h2>
                  {escenario.location && (
                    <p className='mt-1 text-sm text-slate-400'>📍 {escenario.location}</p>
                  )}
                </div>
                {escenario.capacity && (
                  <span className='rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300'>
                    {t('capacity')}: {escenario.capacity}
                  </span>
                )}
              </div>

              {/* Días */}
              <div className='space-y-6'>
                {escenario.dias.map((dia: any) => (
                  <div key={dia.id} className='rounded-2xl border border-white/5 bg-white/5 p-5'>
                    <div className='mb-4 flex items-center gap-3'>
                      <svg className='h-6 w-6 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      <div>
                        <h3 className='font-bold text-white'>
                          {new Date(dia.date).toLocaleDateString('es-ES', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        {dia.name && <p className='text-sm text-slate-400'>{dia.name}</p>}
                      </div>
                      <span className='ml-auto rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300'>
                        {dia.conferencias.length} {t('conferencesCount')}
                      </span>
                    </div>

                    {/* Conferencias */}
                    {dia.conferencias.length === 0 ? (
                      <p className='py-4 text-center text-sm text-slate-400'>{t('emptyDay')}</p>
                    ) : (
                      <div className='space-y-3'>
                        {dia.conferencias.map((conf: any) => (
                          <div
                            key={conf.id}
                            className='rounded-xl border border-white/10 bg-slate-900/50 p-4 transition hover:border-blue-500/30'
                          >
                            <div className='grid md:flex items-start gap-4'>
                              <div className='flex-shrink-0 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-center'>
                                <div className='text-xs font-semibold text-blue-300'>
                                  {conf.start_time}
                                </div>
                                <div className='text-xs text-slate-400'>{conf.end_time}</div>
                              </div>
                              <div className='flex-1'>
                                <div className='mb-1 flex items-center gap-2'>
                                  <h4 className='font-semibold text-white'>{conf.title}</h4>
                                  <span className='rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-300'>
                                    {conf.type}
                                  </span>
                                </div>
                                {conf.description && (
                                  <p className='mb-2 text-sm text-slate-400 line-clamp-2'>
                                    {conf.description}
                                  </p>
                                )}
                                {conf.room && (
                                  <p className='text-xs text-slate-500'>📍 {conf.room}</p>
                                )}
                                {conf.ponentes && conf.ponentes.length > 0 && (
                                  <div className='mt-2 flex flex-wrap gap-2'>
                                    {conf.ponentes.map((p: any, idx: number) => (
                                      <span
                                        key={idx}
                                        className='inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-200'
                                      >
                                        👤 {p.name}
                                        {p.role !== 'speaker' && (
                                          <span className='text-emerald-300/70'>({p.role})</span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
