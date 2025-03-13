'use client'

import { useState } from 'react'
import { useSessionUser } from 'app/store/session-user'
import { QrPrinterPonente } from './QrPrinterPonentes'
import { EditPonentes } from './EditPonentes'

export function ListPonentes({ ponente }) {
  const { userSession } = useSessionUser()
  const role = userSession.role

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPonentes, setFilteredPonentes] = useState(ponente)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const searchResults = (query) => {
    setSearchTerm(query)

    if (query.trim() === '') {
      setFilteredPonentes(ponente)
      setCurrentPage(1)
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = ponente.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.lastname.toLowerCase().includes(lowerQuery) ||
        item.email.toLowerCase().includes(lowerQuery)
    )

    setFilteredPonentes(results)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredPonentes.length / itemsPerPage)
  const currentPonentes = filteredPonentes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
          className='w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm text-black'
        />
      </div>

      <div className='w-full overflow-x-auto bg-[#212136] p-5 py-10 rounded-lg'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-slate-900 text-white'>
            <tr>
              <th className='px-3 py-2'>Name</th>
              <th className='px-3 py-2'>email</th>
              <th className='px-3 py-2'>Company</th>
              <th className='px-3 py-2'>Stage</th>
              {role === 'admin' && <th className='px-3 py-2'>Impressions</th>}
              <th className='px-3 py-2'></th>
            </tr>
          </thead>
          <tbody>
            {currentPonentes.map((ponente) => (
              <tr key={ponente.id} className='border-b'>
                <td className='px-4 py-2'>{ponente.speaker_name}</td>
                <td className='px-4 py-2'>{ponente.email}</td>
                <td className='px-4 py-2'>{ponente.company}</td>
                <td className='px-4 py-2'>{ponente.escenario}</td>
                {role === 'admin' && (
                  <td className='px-4 py-2'>{ponente.impresiones}</td>
                )}
                <td className='px-4 py-2 flex gap-2'>
                  <QrPrinterPonente ponente={ponente} />
                  <EditPonentes ponente={ponente} />
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
            className='px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50'
          >
            Previous
          </button>
          <span className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
