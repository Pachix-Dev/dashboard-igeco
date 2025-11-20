'use client'

import {EditUser} from './EditUser'
import {EditPassword} from './EditPassword'
import {useTranslations} from 'next-intl'
import {useState} from 'react'

export function ListUsers({users}) {
  const t = useTranslations('UsersPage')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(users)

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
        item.event?.toLowerCase().includes(lowerQuery)
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
    if (role === 'exhibitorplus') return t('form.roles.exhibitorplus')
    if (role === 'exhibitor') return t('form.roles.exhibitor')
    return role || t('table.noData')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            {t('list.label')}
          </p>
          <h3 className="text-xl font-bold text-white">{t('list.title')}</h3>
          <p className="text-sm text-slate-400">{t('list.desc')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              id="Search"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => searchResults(e.target.value)}
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

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-blue-500/10">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-base font-semibold text-blue-200">
              {filteredUsers.length}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{t('search.inView')}</p>
              <p className="font-semibold text-white">{t('search.found', {count: filteredUsers.length})}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 shadow-inner shadow-blue-500/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-6 py-3">{t('table.user')}</th>
                <th className="px-6 py-3">{t('table.role')}</th>
                <th className="px-6 py-3">{t('table.event')}</th>
                <th className="px-6 py-3 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => {
                  const roleTone =
                    user.role === 'exhibitorplus'
                      ? 'border-amber-500/30 bg-amber-500/15 text-amber-100'
                      : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100'

                  return (
                    <tr key={user.id ?? user.email ?? index} className="transition hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{user.name || t('table.noData')}</div>
                        <p className="text-xs text-slate-400">{user.email || t('table.noData')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold ${roleTone}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current opacity-70"></span>
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                          <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                          {user.event || t('table.noData')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <EditUser user={user} />
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
