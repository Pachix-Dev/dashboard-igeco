'use client'

import {useTranslations} from 'next-intl'
import {useToaster} from 'app/context/ToasterContext'
import * as XLSX from 'xlsx'

export function ExportExcel({leads}) {
  const t = useTranslations('ScanLeadsPage')
  const {notify} = useToaster()

  const exportToExcel = () => {
    if (!leads.length) return notify(t('export.empty'), 'error')

    const leadsData = leads.map((lead) => ({
      Name: `${lead.name} ${lead.paternSurname} ${lead.maternSurname}`,
      Email: lead.email,
      Phone: lead.phone,
      Company: lead.company,
      Position: lead.position,
      Country: lead.country,
      State: lead.state,
      City: lead.city,
      Notes: lead.notes,
    }))
    const ws = XLSX.utils.json_to_sheet(leadsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Leads')
    XLSX.writeFile(wb, 'leads.xlsx')
    notify(t('export.success'), 'success')
  }

  return (
    <button
      onClick={exportToExcel}
      className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:border-emerald-300/60 hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:ring-offset-2 focus:ring-offset-slate-950"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v7.5A2.25 2.25 0 0 0 7.5 20.25h9a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 16.5 8.25H15m-6 0V6a3 3 0 1 1 6 0v2.25m-6 0h6m-3 4.5v3"
        />
      </svg>
      <span>{t('export.cta')}</span>
    </button>
  )
}
