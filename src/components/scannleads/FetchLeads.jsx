'use client'

import { useState } from 'react'
import { AddNotes } from './AddNotes'

export function FetchLeads({ leads }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Calculate total pages
  const totalPages = Math.ceil(leads.length / itemsPerPage)

  // Get the current page items
  const currentLeads = leads.slice(
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
          <thead>
            <tr className='bg-[#16171C] rounded-lg h-8'>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Name
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Email
              </th>

              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Company
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Position
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Created
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'></th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead, index) => (
              <tr key={index}>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.name} {lead.paternSurname} {lead.maternSurname}
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.email}
                </td>

                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.company}
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.position}
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.created_at.toLocaleDateString()}
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  <AddNotes lead={lead} />
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
