'use client'

import { useState } from 'react'
import { EditExhibitor } from '../exhibitors/EditExhibitor'
import { QrPrinter } from '../exhibitors/QrPrinter'
import { useSessionUser } from 'app/store/session-user'

export function ListExhibitors({ exhibitors }) {
  const { userSession } = useSessionUser()
  const [currentPage, setCurrentPage] = useState(1)
  const role = userSession ? userSession.role : null

  const itemsPerPage = 4

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredExhibitors, setFilteredExhibitors] = useState(exhibitors)

  // Función de búsqueda
  const searchResults = (query) => {
    setSearchTerm(query)

    if (query.trim() === '') {
      setFilteredExhibitors(exhibitors)
      setCurrentPage(1) // Reiniciar a la primera página
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = exhibitors.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerQuery) ||
        item.lastname?.toLowerCase().includes(lowerQuery) ||
        item.email?.toLowerCase().includes(lowerQuery) ||
        item.nationality?.toLowerCase().includes(lowerQuery)
    )

    setFilteredExhibitors(results)
    setCurrentPage(1) // Reiniciar a la primera página
  }

  // Calcular total de páginas basado en los resultados filtrados
  const totalPages = Math.ceil(filteredExhibitors.length / itemsPerPage)

  // Obtener los elementos de la página actual
  const currentExhibitors = filteredExhibitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Manejo de la paginación
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
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
          value={searchTerm}
          onChange={(e) => searchResults(e.target.value)}
          className='w-full rounded-md border-gray-200 py-2.5 ps-2 pe-10 shadow-sm sm:text-sm text-black'
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
              <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'>
                Name
              </th>
              <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'>
                Lastname
              </th>
              <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'>
                Email
              </th>
              <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'>
                Position
              </th>
              <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'>
                Nationality
              </th>
              {role === 'admin' && (
                <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'>
                  Impressions
                </th>
              )}
              <th className='h-8 border-b border-t px-3 text-xs font-semibold text-slate-11'></th>
            </tr>
          </thead>
          <tbody>
            {currentExhibitors.map((exhibitor) => (
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
                <td className='border-b border-gray-200 text-sm flex items-center justify-center gap-2 h-20'>
                  <EditExhibitor exhibitor={exhibitor} />
                  <QrPrinter exhibitor={exhibitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className='flex justify-between items-center mt-4'>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className='px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50'
          >
            Previous
          </button>

          <span className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className='px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
