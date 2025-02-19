'use client'

import { useState } from 'react'
import { EditExhibitor } from '../exhibitors/EditExhibitor'
import { QrPrinter } from '../exhibitors/QrPrinter'
import { useSessionUser } from 'app/store/session-user'

export function ListExhibitors({ exhibitors }) {
  const { userSession } = useSessionUser()
  const role = userSession.role

  const [searchTerm, setSearchTerm] = useState(exhibitors)
  // Debounced function to avoid multiple API calls

  const searchResults = (e) => {
    if (e === '') {
      setSearchTerm(exhibitors)
      return
    }
    const query = e.toLowerCase()

    const results = exhibitors.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.lastname.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.nationality.toLowerCase().includes(query)
    )

    setSearchTerm(results)
  }

  return (
    <>
      <div className='relative w-3/5 mx-auto'>
        <label htmlFor='Search' className='sr-only'>
          Search
        </label>

        <input
          type='text'
          id='Search'
          placeholder='Search for...'
          onChange={(e) => searchResults(e.target.value)}
          className='w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm text-black'
        />

        <span className='absolute inset-y-0 end-0 grid w-10 place-content-center'>
          <button type='button' className='text-gray-600 hover:text-gray-700'>
            <span className='sr-only'>Search</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
              />
            </svg>
          </button>
        </span>
      </div>

      <div className='w-full overflow-x-auto overflow-y-hidden bg-[#212136] p-5 py-10 rounded-lg'>
        <table className='m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full'>
          <thead className='bg-slate-900 rounded-md'>
            <tr className='text-left text-xs *:font-extrabold tracking-wider text-white'>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Name
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Lastname
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                email
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                position
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                nationality
              </th>
              {role === 'admin' && (
                <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                  impresiones
                </th>
              )}
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'></th>
            </tr>
          </thead>
          <tbody>
            {searchTerm.map((exhibitor) => (
              <tr key={exhibitor.id}>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {exhibitor.name}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {exhibitor.lastname}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {exhibitor.email}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {exhibitor.position}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {exhibitor.nationality}
                </td>
                {role === 'admin' && (
                  <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                    {exhibitor.impresiones}
                  </td>
                )}
                <td className='border-b border-gray-200 text-sm flex items-center justify-center gap-2 h-24'>
                  <EditExhibitor exhibitor={exhibitor} />
                  <QrPrinter exhibitor={exhibitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
