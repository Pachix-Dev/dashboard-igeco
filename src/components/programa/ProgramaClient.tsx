'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { GestionEscenarios } from './GestionEscenarios'
import { GestionDias } from './GestionDias'
import { GestionConferencias } from './GestionConferencias'
import { VistaCompleta } from './VistaCompleta'
import type { Escenario, ProgramaDia, Conferencia } from '@/types/programa'

type ProgramaClientProps = {
  initialEscenarios?: Escenario[]
  initialDias?: ProgramaDia[]
}

export function ProgramaClient({ initialEscenarios = [], initialDias = [] }: ProgramaClientProps) {
  const t = useTranslations('ProgramaPage')
  const [activeTab, setActiveTab] = useState('escenarios')
  

  // Estados para datos
  const [escenarios, setEscenarios] = useState<Escenario[]>(initialEscenarios)
  const [dias, setDias] = useState<ProgramaDia[]>(initialDias)
  const [conferencias, setConferencias] = useState<Conferencia[]>([])

  // Cargar datos iniciales
  useEffect(() => {
    if (!initialEscenarios?.length) {
      loadEscenarios()
    }
    if (!initialDias?.length) {
      loadDias() // Cargar días al inicio para que estén disponibles en conferencias
    }
  }, [initialEscenarios?.length, initialDias?.length])

  // Cargar días cuando se cambia a la pestaña de conferencias
  useEffect(() => {
    if (activeTab === 'conferencias' && dias.length === 0) {
      loadDias()
    }
    if (activeTab === 'conferencias' && conferencias.length === 0) {
      loadConferencias()
    }
  }, [activeTab, dias.length])

  const loadEscenarios = async () => {
    try {
      const response = await fetch('/api/programa/escenarios')
      const data = await response.json()
      if (response.ok) {
        setEscenarios(data.data || [])
      }
    } catch (error) {
      console.error('Error al cargar escenarios:', error)
    }
  }

  const loadDias = async (escenarioId?: number) => {
    try {
      const url = escenarioId 
        ? `/api/programa/dias?escenario_id=${escenarioId}`
        : '/api/programa/dias'
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok) {
        setDias(data.data || [])
      }
    } catch (error) {
      console.error('Error al cargar días:', error)
    }
  }

  const loadConferencias = async (diaId?: number) => {
    try {
      const url = diaId 
        ? `/api/programa/conferencias?dia_id=${diaId}`
        : '/api/programa/conferencias'
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok) {
        setConferencias(data.data || [])
      }
    } catch (error) {
      console.error('Error al cargar conferencias:', error)
    }
  }

  const tabs = [
    { id: 'escenarios', label: t('tabs.escenarios'), icon: '🏛️' },
    { id: 'dias', label: t('tabs.dias'), icon: '📅' },
    { id: 'conferencias', label: t('tabs.conferencias'), icon: '🎤' },
    { id: 'vista', label: t('tabs.vista'), icon: '👁️' },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <div className='mb-2 flex items-center gap-3'>
            <h1 className='text-3xl font-bold text-white'>{t('title')}</h1>
            <span className='rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200'>
              {t('badge', { count: escenarios.length })}
            </span>
          </div>
          <p className='text-sm text-slate-400'>{t('subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-white/10'>
        <nav className='flex gap-2 overflow-x-auto' aria-label='Tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <span className='text-lg'>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      <div className='min-h-[500px]'>
        {activeTab === 'escenarios' && (
          <GestionEscenarios
            escenarios={escenarios}
            onUpdate={loadEscenarios}
          />
        )}
        {activeTab === 'dias' && (
          <GestionDias
            escenarios={escenarios}
            dias={dias}
            onUpdate={loadDias}
          />
        )}
        {activeTab === 'conferencias' && (
          <GestionConferencias
            escenarios={escenarios}
            dias={dias}
            conferencias={conferencias}
            onUpdate={loadConferencias}
          />
        )}
        {activeTab === 'vista' && (
          <VistaCompleta escenarios={escenarios} />
        )}
      </div>
    </div>
  )
}
