'use client'

import React, { useEffect, useState } from 'react'
import { ExportExcel } from './ExportExcel'
import { FetchLeads } from './FetchLeads'
import { QrScanner } from './QrScanner'

export function ScanLeadsClient({ initialLeads }) {
  const [leads, setLeads] = useState(initialLeads || [])

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

  return (
    <>
      <div className='flex flex-wrap items-center gap-3'>
        <ExportExcel leads={leads} />
        <QrScanner />
      </div>

      <div className='rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur mt-6'>
        <FetchLeads leads={leads} onLeadsChange={handleUpdateNote} />
      </div>
    </>
  )
}
