'use client'

import { useState, useEffect, useId } from 'react'
import { useTranslations } from 'next-intl'
import { AddNotes } from './AddNotes'
import { getScanLeadValue, scanLeadFields } from '@/lib/scanleads-fields'

export function FetchLeads({ leads, onLeadsChange }) {
  const t = useTranslations('ScanLeadsPage')
  const searchId = useId()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [leadsData, setLeadsData] = useState(leads)
  useEffect(() => {
    setLeadsData(leads)
  }, [leads])
  const itemsPerPage = 10

  const handleUpdateNote = (uuid, newNotes) => {
    setLeadsData((prevLeads) =>
      prevLeads.map((lead) =>
        lead.uuid === uuid ? { ...lead, notes: newNotes } : lead
      )
    )
    if (typeof onLeadsChange === 'function') {
      onLeadsChange(uuid, newNotes)
    }
  }

  const filteredLeads = leadsData.filter((lead) =>
    scanLeadFields.map(({ key }) => getScanLeadValue(lead, key)).join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage))
  const visiblePage = Math.min(currentPage, totalPages)

  const currentLeads = filteredLeads.slice(
    (visiblePage - 1) * itemsPerPage,
    visiblePage * itemsPerPage
  )

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(visiblePage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(Math.min(visiblePage + 1, totalPages))
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0 space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-500'>
            {t('list.label')}
          </p>
          <h3 className='text-xl font-bold text-white'>{t('list.title')}</h3>
          <p className='text-sm text-slate-400'>{t('list.desc')}</p>
        </div>
        <div className='relative w-full shrink-0 sm:w-72 lg:w-80'>
          <label htmlFor={searchId} className='sr-only'>
            {t('search.placeholder')}
          </label>
          <input
            type='search'
            id={searchId}
            value={searchTerm}
            placeholder={t('search.placeholder')}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full rounded-xl border border-white/10 bg-slate-900/70 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 shadow-inner shadow-blue-500/10 transition focus:border-blue-400/60 focus:outline-none'
          />
          <span className='pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-slate-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-4 w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
              />
            </svg>
          </span>
        </div>
      </div>

      <div className='min-w-0 rounded-2xl border border-white/10 bg-slate-950/50 shadow-inner shadow-blue-500/5'>
        <table role='table' aria-label={t('list.title')} className='block w-full lg:table lg:table-fixed'>
          <thead role='rowgroup' className='hidden bg-white/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-300 lg:table-header-group'>
            <tr role='row'>
              <th scope='col' className='w-[27%] rounded-tl-2xl px-4 py-3'>{t('table.contact')}</th>
              <th scope='col' className='w-[23%] px-4 py-3'>{t('table.companyAndPosition')}</th>
              <th scope='col' className='w-[15%] px-4 py-3'>{t('table.phone')}</th>
              <th scope='col' className='w-[25%] px-4 py-3'>{t('table.location')}</th>
              <th scope='col' className='w-[10%] rounded-tr-2xl px-4 py-3 text-right'>
                <span className='sr-only'>{t('table.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody role='rowgroup' className='grid gap-3 p-3 md:grid-cols-2 lg:table-row-group lg:p-0'>
            {currentLeads.length === 0 ? (
              <tr role='row' className='col-span-full lg:table-row'>
                <td
                  role='cell'
                  colSpan={5}
                  className='block px-4 py-8 text-center text-sm text-slate-400 lg:table-cell'
                >
                  {t('empty')}
                </td>
              </tr>
            ) : (
              currentLeads.map((lead, index) => {
                const fullName = [getScanLeadValue(lead, 'name'), getScanLeadValue(lead, 'paternSurname')]
                  .filter(Boolean).join(' ')
                const email = getScanLeadValue(lead, 'email')
                const company = getScanLeadValue(lead, 'company')
                const position = getScanLeadValue(lead, 'position')
                const phone = getScanLeadValue(lead, 'phone')
                const locality = [getScanLeadValue(lead, 'municipality'), getScanLeadValue(lead, 'state'), getScanLeadValue(lead, 'country')]
                  .filter(Boolean).join(', ')
                const postalCode = getScanLeadValue(lead, 'postalCode')
                const country = getScanLeadValue(lead, 'country')

                return (
                  <tr
                    role='row'
                    key={lead.uuid || `${lead.email}-${index}`}
                    className='relative grid min-w-0 grid-cols-2 gap-x-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/5 lg:table-row lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0'
                  >
                    <td role='cell' className='col-span-2 min-w-0 pb-3 pr-12 align-top lg:table-cell lg:border-t lg:border-white/5 lg:px-4 lg:py-4'>
                      <p className='font-semibold text-white [overflow-wrap:anywhere]'>
                        {fullName || '—'}
                      </p>
                      {email && <p className='mt-1 text-xs text-slate-400 [overflow-wrap:anywhere]'>{email}</p>}
                    </td>
                    <td role='cell' className='min-w-0 border-t border-white/5 py-3 align-top lg:table-cell lg:px-4 lg:py-4'>
                      <span className='mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:hidden'>
                        {t('table.companyAndPosition')}
                      </span>
                      <p className='text-sm font-medium text-slate-200 [overflow-wrap:anywhere]'>{company || '—'}</p>
                      {position && <p className='mt-1 text-xs text-slate-400 [overflow-wrap:anywhere]'>{position}</p>}
                    </td>
                    <td role='cell' className='min-w-0 border-t border-white/5 py-3 align-top lg:table-cell lg:px-4 lg:py-4'>
                      <span className='mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:hidden'>
                        {t('table.phone')}
                      </span>
                      <p className='text-sm text-slate-200 [overflow-wrap:anywhere]'>{phone || '—'}</p>
                    </td>
                    <td role='cell' className='col-span-2 min-w-0 space-y-1 border-t border-white/5 pt-3 align-top lg:table-cell lg:px-4 lg:py-4'>
                      <span className='mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:hidden'>
                        {t('table.location')}
                      </span>
                      {locality && <p className='text-sm text-slate-200 [overflow-wrap:anywhere]'>{locality}</p>}
                      {postalCode && (
                        <p className='text-xs text-slate-400 [overflow-wrap:anywhere]'>
                          {t('table.postalCode')}: <span className='text-slate-300'>{postalCode}</span>
                        </p>
                      )}
                      {!locality && !country && !postalCode && <p className='text-sm text-slate-400'>—</p>}
                    </td>
                    <td role='cell' className='absolute right-4 top-4 block align-top lg:static lg:table-cell lg:border-t lg:border-white/5 lg:px-4 lg:py-4'>
                      <div className='flex justify-end'>
                        <AddNotes lead={lead} onUpdate={handleUpdateNote} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        <div className='flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm text-slate-400'>
            {t('pagination.page', { current: visiblePage, total: totalPages })}
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={handlePreviousPage}
              disabled={visiblePage === 1}
              className='rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'
            >
              {t('pagination.prev')}
            </button>
            <button
              onClick={handleNextPage}
              disabled={visiblePage === totalPages}
              className='rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
