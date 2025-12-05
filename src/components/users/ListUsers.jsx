'use client'

import { EditUser } from './EditUser'
import { EditPassword } from './EditPassword'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function ListUsers({ users: initialUsers, onUserUpdated }) {
  const t = useTranslations('UsersPage')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  const [users, setUsers] = useState(initialUsers)

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(initialUsers)

  // Actualizar estado cuando cambien los usuarios desde el padre
  useEffect(() => {
    setUsers(initialUsers)
    if (searchTerm.trim() === '') {
      setFilteredUsers(initialUsers)
    } else {
      const lowerQuery = searchTerm.toLowerCase()
      const results = initialUsers.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerQuery) ||
          item.email?.toLowerCase().includes(lowerQuery) ||
          item.event?.toLowerCase().includes(lowerQuery) ||
          item.company?.toLowerCase().includes(lowerQuery) ||
          item.stand?.toLowerCase().includes(lowerQuery)
      )
      setFilteredUsers(results)
    }
  }, [initialUsers, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))

  const searchResults = (query) => {
    setSearchTerm(query)

    if (query.trim() === '') {
      setFilteredUsers(users)
      setCurrentPage(1)
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = users.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerQuery) ||
        item.email?.toLowerCase().includes(lowerQuery) ||
        item.event?.toLowerCase().includes(lowerQuery) ||
        item.company?.toLowerCase().includes(lowerQuery) ||
        item.stand?.toLowerCase().includes(lowerQuery)
    )

    setFilteredUsers(results)
    setCurrentPage(1)
  }

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const roleLabel = (role) => {
    if (role === 'exhibitor') return t('form.roles.exhibitor')
    return role || t('table.noData')
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-500'>
            {t('list.label')}
          </p>
          <h3 className='text-xl font-bold text-white'>{t('list.title')}</h3>
          <p className='text-sm text-slate-400'>{t('list.desc')}</p>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <div className='relative w-full sm:w-72'>
            <input
              type='text'
              id='Search'
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => searchResults(e.target.value)}
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
      </div>

      <div className='overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 shadow-inner shadow-blue-500/5'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-white/5'>
            <thead className='bg-white/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-300'>
              <tr>
                <th className='px-6 py-3'>Logo</th>
                <th className='px-6 py-3'>{t('table.user')}</th>
                <th className='px-6 py-3'>{t('table.company')}</th>
                <th className='px-6 py-3'>Stand</th>
                <th className='px-6 py-3'>{t('table.role')}</th>
                <th className='px-6 py-3'>{t('table.event')}</th>
                <th className='px-6 py-3'>Status</th>
                <th className='px-6 py-3'>ShowInDirectory</th>
                <th className='px-6 py-3 text-right'>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className='px-6 py-8 text-center text-sm text-slate-400'
                  >
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => {
                  const roleTone =
                    'border-emerald-500/30 bg-emerald-500/15 text-emerald-100'
                  const statusLabel = user.status === 1 ? 'Activo' : 'Inactivo'
                  const statusColor =
                    user.status === 1
                      ? 'border-green-500/30 bg-green-500/15 text-green-100'
                      : 'border-red-500/30 bg-red-500/15 text-red-100'
                  const directoryLabel = user.show_directory === 1 ? 'Sí' : 'No'
                  const directoryColor =
                    user.show_directory === 1
                      ? 'border-blue-500/30 bg-blue-500/15 text-blue-100'
                      : 'border-slate-500/30 bg-slate-500/15 text-slate-100'

                  return (
                    <tr
                      key={user.id ?? user.email ?? index}
                      className='transition hover:bg-white/5'
                    >
                      {/* Logo Column */}
                      <td className='px-6 py-4'>
                        <div className='h-12 w-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center'>
                          {user.photo ? (
                            <Image
                              src={`/logos/${user.photo}`}
                              alt={user.name || 'Logo'}
                              width={48}
                              height={48}
                              className='object-cover w-full h-full'
                            />
                          ) : (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-6 h-6 text-slate-500'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z'
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      {/* User Column */}
                      <td className='px-6 py-4'>
                        <div className='font-semibold text-white'>
                          {user.name || t('table.noData')}
                        </div>
                        <p className='text-xs text-slate-400'>
                          {user.email || t('table.noData')}
                        </p>
                      </td>
                      {/* Company Column */}
                      <td className='px-6 py-4 text-sm text-slate-200'>
                        {user.company || t('table.noData')}
                      </td>
                      {/* Stand Column */}
                      <td className='px-6 py-4 text-sm text-slate-200'>
                        {user.stand || t('table.noData')}
                      </td>
                      {/* Role Column */}
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold ${roleTone}`}
                        >
                          <span className='h-2 w-2 rounded-full bg-current opacity-70'></span>
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      {/* Event Column */}
                      <td className='px-6 py-4'>
                        <span className='inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100'>
                          <span className='h-2 w-2 rounded-full bg-blue-400'></span>
                          {user.event || t('table.noData')}
                        </span>
                      </td>
                      {/* Status Column */}
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold ${statusColor}`}
                        >
                          <span className='h-2 w-2 rounded-full bg-current opacity-70'></span>
                          {statusLabel}
                        </span>
                      </td>
                      {/* ShowInDirectory Column */}
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold ${directoryColor}`}
                        >
                          <span className='h-2 w-2 rounded-full bg-current opacity-70'></span>
                          {directoryLabel}
                        </span>
                      </td>
                      {/* Actions Column */}
                      <td className='px-6 py-4'>
                        <div className='flex flex-wrap justify-end gap-2'>
                          <EditUser user={user} onUserUpdated={onUserUpdated} />
                          <EditPassword user={user} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className='flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm text-slate-400'>
            {t('pagination.page', { current: currentPage, total: totalPages })}
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className='rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'
            >
              {t('pagination.prev')}
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
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
