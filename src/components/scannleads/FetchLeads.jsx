'use client'

import { useState } from 'react'
import { AddNotes } from './AddNotes'

export function FetchLeads({ leads }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  // Calculate total pages
  const totalPages = Math.ceil(leads.length / itemsPerPage)

  // Filter leads based on search term
  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.paternSurname} ${lead.maternSurname} ${lead.email} ${lead.nacionality} ${lead.company} ${lead.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  // Get the current page items
  const currentLeads = filteredLeads.slice(
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

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page on search
  }

  return (
    <>
      <div className='w-full overflow-x-auto overflow-y-auto lg:max-h-[560px] bg-[#212136] p-5 rounded-md shadow-md'>
        <div className='relative my-5'>
          <label htmlFor='Search' className='sr-only'>
            {' '}
            Search{' '}
          </label>

          <input
            type='text'
            id='Search'
            placeholder='Search for...'
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full rounded-md border-gray-200 py-2.5 ps-2 pe-10 shadow-xs sm:text-sm text-black'
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

        <table className='m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full'>
          <thead>
            <tr className='bg-[#0A0A14] rounded-lg h-8'>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Name
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Nationality
              </th>

              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Company
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Position
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
                Phone
              </th>
              <th className='h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'></th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead, index) => (
              <tr key={index}>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs font-bold'>
                  {lead.name} {lead.paternSurname} {lead.maternSurname} <br />
                  <span className='font-thin text-slate-300'>{lead.email}</span>
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.nacionality}
                </td>

                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.company}
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.position}
                </td>
                <td className='py-3 border-slate-6 h-10 w-fit overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm sm:text-xs'>
                  {lead.phone}
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
