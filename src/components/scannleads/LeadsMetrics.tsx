'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface Lead {
  uuid: string
  name?: string
  lastname?: string
  company?: string
  created_at?: string
  [key: string]: any
}

interface LeadsMetricsProps {
  leads: Lead[]
}

export function LeadsMetrics({ leads }: LeadsMetricsProps) {
  const t = useTranslations('ScanLeadsPage')

  // Calcular métricas
  const metrics = useMemo(() => {
    if (!leads || leads.length === 0) {
      return {
        total: 0,
        today: 0,
        byDay: [],
        byHour: [],
        avgPerDay: 0,
        peakHour: null,
      }
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Leads de hoy
    const todayLeads = leads.filter(lead => {
      if (!lead.created_at) return false
      const leadDate = new Date(lead.created_at)
      return leadDate >= todayStart
    })

    // Agrupar por día
    const byDay: { [key: string]: number } = {}
    leads.forEach(lead => {
      if (!lead.created_at) return
      const date = new Date(lead.created_at)
      const dayKey = date.toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      })
      byDay[dayKey] = (byDay[dayKey] || 0) + 1
    })

    // Agrupar por hora (solo leads de hoy)
    const byHour: { [key: number]: number } = {}
    todayLeads.forEach(lead => {
      if (!lead.created_at) return
      const hour = new Date(lead.created_at).getHours()
      byHour[hour] = (byHour[hour] || 0) + 1
    })

    // Convertir a arrays ordenados
    const dayArray = Object.entries(byDay)
      .map(([day, count]) => ({ day, count }))
      .slice(-7) // Últimos 7 días

    const hourArray = Object.entries(byHour)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour)

    // Hora pico
    const peakHourEntry = hourArray.length > 0 
      ? hourArray.reduce((max, curr) => curr.count > max.count ? curr : max)
      : null

    // Promedio por día
    const uniqueDays = Object.keys(byDay).length
    const avgPerDay = uniqueDays > 0 ? Math.round(leads.length / uniqueDays) : 0

    return {
      total: leads.length,
      today: todayLeads.length,
      byDay: dayArray,
      byHour: hourArray,
      avgPerDay,
      peakHour: peakHourEntry,
    }
  }, [leads])

  return (
    <div className="grid gap-6 mb-6">
      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Leads */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 border border-emerald-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-emerald-500/20 p-2">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Total Leads</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.total}</p>
            <p className="text-xs text-emerald-400 mt-1">Capturados en total</p>
          </div>
        </div>

        {/* Leads de Hoy */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 border border-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Hoy</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.today}</p>
            <p className="text-xs text-blue-400 mt-1">Leads capturados hoy</p>
          </div>
        </div>

        {/* Promedio por Día */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 border border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Promedio Diario</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.avgPerDay}</p>
            <p className="text-xs text-purple-400 mt-1">Leads por día</p>
          </div>
        </div>

        {/* Hora Pico */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 border border-orange-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-orange-500/20 p-2">
                <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-400">Hora Pico</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {metrics.peakHour ? `${metrics.peakHour.hour}:00` : '--'}
            </p>
            <p className="text-xs text-orange-400 mt-1">
              {metrics.peakHour ? `${metrics.peakHour.count} leads escaneados` : 'Sin datos'}
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por Día */}
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Leads por Día</h3>
          <div className="space-y-3">
            {metrics.byDay.length > 0 ? (
              metrics.byDay.map(({ day, count }) => {
                const maxCount = Math.max(...metrics.byDay.map(d => d.count))
                const percentage = (count / maxCount) * 100
                
                return (
                  <div key={day} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{day}</span>
                      <span className="font-semibold text-white">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-slate-400 py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Gráfico por Hora */}
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Leads por Hora (Hoy)</h3>
          <div className="space-y-3">
            {metrics.byHour.length > 0 ? (
              metrics.byHour.map(({ hour, count }) => {
                const maxCount = Math.max(...metrics.byHour.map(h => h.count))
                const percentage = (count / maxCount) * 100
                const isPeak = metrics.peakHour?.hour === hour
                
                return (
                  <div key={hour} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 flex items-center gap-2">
                        {hour.toString().padStart(2, '0')}:00
                        {isPeak && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                            Pico
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-white">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPeak 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-slate-400 py-8">No hay datos para hoy</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
