'use client'

import { EditUser } from './EditUser'
import { EditPassword } from './EditPassword'
import { useState } from 'react'

export function ListUsers({ users }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(users)

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const searchResults = (query) => {
    setSearchTerm(query)

    if (query.trim() === '') {
      setFilteredUsers(users)
      setCurrentPage(1) // Reiniciar a la primera página
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
    setCurrentPage(1) // Reiniciar a la primera página
  }

  // Obtener los elementos de la página actual
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Manejo de la navegación entre páginas
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
        <table className='min-w-full table-auto border-separate border-spacing-0'>
          <thead className='bg-slate-900 text-white'>
            <tr>
              <th className='py-3 px-4 text-sm font-semibold text-left'>
                Nombre
              </th>
              <th className='py-3 px-4 text-sm font-semibold text-left'>
                Correo
              </th>
              <th className='py-3 px-4 text-sm font-semibold text-left'>Rol</th>
              <th className='py-3 px-4 text-sm font-semibold text-left'>
                Evento
              </th>
              <th className='py-3 px-4 text-sm font-semibold text-left'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={index}
                className='hover:bg-black-100 border-b border-gray-200 transition-colors'
              >
                <td className='py-3 px-4 text-sm'>{user.name}</td>
                <td className='py-3 px-4 text-sm'>{user.email}</td>
                <td className='py-3 px-4 text-sm'>{user.role}</td>
                <td className='py-3 px-4 text-sm'>{user.event}</td>
                <td className='py-3 px-4 text-sm flex gap-2'>
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
          className='px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50'
        >
          Anterior
        </button>

        <span className='text-sm text-gray-600'>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50'
        >
          Siguiente
        </button>
      </div>
    </>
  )
}
