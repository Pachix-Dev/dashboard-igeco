'use client'

import { EditUser } from './EditUser'
import { EditPassword } from './EditPassword'
import { useState } from 'react'
import { getSpanishDateString } from '../../utils/helpers.js'

export function ListUsers({ users }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Calculate total pages
  const totalPages = Math.ceil(users.length / itemsPerPage)

  // Get the current page items
  const currentLeads = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle page navigation
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  return (
    <>
      <div className='w-full overflow-x-auto overflow-y-hidden'>
        <table className='m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full'>
          <thead className='bg-slate-900 rounded-md'>
            <tr className='text-left text-xs *:font-extrabold tracking-wider text-white'>
              <th className='py-2 px-4 '>Nombre</th>
              <th className='py-2 px-4'>Correo</th>
              <th className='py-2 px-4'>Rol</th>
              <th className='py-2 px-4'>Event</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((user, index) => (
              <tr key={index}>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {user.name}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {user.email}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {user.role}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm'>
                  {user.event}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm flex gap-2 w-fit'>
                  <EditUser user={user} />
                  <EditPassword user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    </>
  )
}
