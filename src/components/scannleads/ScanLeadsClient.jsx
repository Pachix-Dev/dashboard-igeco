'use client'

import React, { useEffect, useState } from 'react'
import { ExportExcel } from './ExportExcel'
import { FetchLeads } from './FetchLeads'
import { QrScanner } from './QrScanner'
import { SessionManager } from './SessionManager'
import { BuySessionSlots } from './BuySessionSlots'
import { AccountDisable } from '@/components/shared/AccountDisable'
import { useSessionUser } from '@/store/session-user'
import { useRouter } from 'next/navigation'

export function ScanLeadsClient({ initialLeads, maxSessions, activeSessions }) {
  const [leads, setLeads] = useState(initialLeads || [])
  const [showSessionManager, setShowSessionManager] = useState(false)
  const { userSession } = useSessionUser()
  const router = useRouter()

  useEffect(() => {
    setLeads(initialLeads || [])
  }, [initialLeads])

  const handleUpdateNote = (uuid, newNotes) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.uuid === uuid ? { ...lead, notes: newNotes } : lead
      )
    )
  }

  const handleAddLead = (newLead) => {
    if (!newLead) return
    setLeads((prev) => {
      const exists = prev.some((l) => l.uuid === newLead.uuid)
      if (exists) {
        return prev.map((l) =>
          l.uuid === newLead.uuid ? { ...l, ...newLead } : l
        )
      }
      return [newLead, ...prev]
    })
  }

  const handleSessionsUpdate = () => {
    router.refresh()
  }

  if (!userSession?.status) {
    return <AccountDisable />
  }

  return (
    <>
      {/* Session info card */}
      <div className='mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-cyan-400/10 p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-4'>
            <div className='rounded-full bg-blue-500/20 p-3'>
              <svg
                className='h-6 w-6 text-blue-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-400'>
                Sesiones Activas
              </p>
              <p className='text-2xl font-bold text-white'>
                {activeSessions}{' '}
                <span className='text-lg text-slate-400'>/ {maxSessions}</span>
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <button
              onClick={() => setShowSessionManager(!showSessionManager)}
              className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
              {showSessionManager ? 'Ocultar Sesiones' : 'Gestionar Sesiones'}
            </button>
            <BuySessionSlots
              currentSlots={maxSessions}
              onPurchaseComplete={handleSessionsUpdate}
            />
          </div>
        </div>

        {/* Barra de progreso */}
        <div className='mt-4 relative h-2 overflow-hidden rounded-full bg-white/10'>
          <div
            className={`h-full transition-all duration-500 ${
              activeSessions >= maxSessions
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400'
            }`}
            style={{
              width: `${maxSessions > 0 ? (activeSessions / maxSessions) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Session Manager (collapsible) */}
      {showSessionManager && (
        <div className='mb-6'>
          <SessionManager onSessionsUpdate={handleSessionsUpdate} />
        </div>
      )}

      <div className='flex flex-wrap items-center gap-3'>
        <ExportExcel leads={leads} />
        <QrScanner onNewLead={handleAddLead} />
      </div>

      <div className='rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur mt-6'>
        <FetchLeads leads={leads} onLeadsChange={handleUpdateNote} />
      </div>
    </>
  )
}
