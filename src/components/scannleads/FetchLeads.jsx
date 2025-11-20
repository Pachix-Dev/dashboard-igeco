'use client'

import {useState} from 'react'
import {useTranslations} from 'next-intl'
import {AddNotes} from './AddNotes'

export function FetchLeads({leads}) {
  const t = useTranslations('ScanLeadsPage')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.paternSurname} ${lead.maternSurname} ${lead.email} ${lead.nacionality} ${lead.company} ${lead.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage))

  const currentLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{t('list.label')}</p>
          <h3 className="text-xl font-bold text-white">{t('list.title')}</h3>
          <p className="text-sm text-slate-400">{t('list.desc')}</p>
        </div>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            id="Search"
            placeholder={t('search.placeholder')}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 shadow-inner shadow-blue-500/10 transition focus:border-blue-400/60 focus:outline-none"
          />
          <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 shadow-inner shadow-blue-500/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">{t('table.name')}</th>
                <th className="px-4 py-3">{t('table.nationality')}</th>
                <th className="px-4 py-3">{t('table.company')}</th>
                <th className="px-4 py-3">{t('table.position')}</th>
                <th className="px-4 py-3">{t('table.phone')}</th>
                <th className="px-4 py-3 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-400">
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead, index) => (
                  <tr key={`${lead.email}-${index}`} className="transition hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">
                        {lead.name} {lead.paternSurname} {lead.maternSurname}
                      </div>
                      <p className="text-xs text-slate-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-200">{lead.nacionality}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{lead.company}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{lead.position}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AddNotes lead={lead} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            {t('pagination.page', {current: currentPage, total: totalPages})}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('pagination.prev')}
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
