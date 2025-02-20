'use client'

import { EditUser } from './EditUser'
import { EditPassword } from './EditPassword'
import { useState } from 'react'
import { getSpanishDateString } from '../../utils/helpers.js'

export function ListUsers({ users }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // Calcular el total de páginas
  const totalPages = Math.ceil(users.length / itemsPerPage)

  // Obtener los elementos de la página actual
  const currentLeads = users.slice(
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
      <div className="w-full overflow-x-auto overflow-y-hidden bg-[#212136] p-5 py-10 rounded-lg">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold text-left">Nombre</th>
              <th className="py-3 px-4 text-sm font-semibold text-left">Correo</th>
              <th className="py-3 px-4 text-sm font-semibold text-left">Rol</th>
              <th className="py-3 px-4 text-sm font-semibold text-left">Evento</th>
              <th className="py-3 px-4 text-sm font-semibold text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((user, index) => (
              <tr
                key={index}
                className="hover:bg-black-100 border-b border-gray-200 transition-colors"
              >
                <td className="py-3 px-4 text-sm">{user.name}</td>
                <td className="py-3 px-4 text-sm">{user.email}</td>
                <td className="py-3 px-4 text-sm">{user.role}</td>
                <td className="py-3 px-4 text-sm">{user.event}</td>
                <td className="py-3 px-4 text-sm flex gap-2">
                  <EditUser user={user} />
                  <EditPassword user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </>
  )
}
