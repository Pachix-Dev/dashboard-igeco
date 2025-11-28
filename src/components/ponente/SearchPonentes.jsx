'use client'

import { useState } from 'react'

export function SearchExhibitors({ exhibitors }) {
  const [searchTerm, setSearchTerm] = useState([])
  const [message, setMessage] = useState('')
  // Debounced function to avoid multiple API calls

  const searchResults = (e) => {
    if (e === '') {
      setSearchTerm(exhibitors)
      setMessage('No results found')
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
    setMessage('estos son los resultados')
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
      {message && (
        <p className='mt-10 font-bold text-center text-red-700'>{message}</p>
      )}
    </>
  )
}
