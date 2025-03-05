'use client'

import { useToaster } from 'app/context/ToasterContext'
import * as XLSX from 'xlsx'

export function ExportExcel({ leads }) {
  const { notify } = useToaster()

  const exportToExcel = () => {
    if (!leads.length) return notify('No leads to export', 'error')

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
  }

  return (
    <>
      <button
        onClick={exportToExcel}
        className='px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-500'
      >
        Export to Excel
      </button>
    </>
  )
}
