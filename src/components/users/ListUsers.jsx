'use client'
import { EditUser } from './EditUser'
import { EditPassword } from './EditPassword'

export function ListUsers({ users }) {
  return (
    <>
      <div className='w-full overflow-x-auto overflow-y-hidden'>
        <table className='m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full'>
          <thead className='bg-slate-900 rounded-md'>
            <tr className='text-left text-xs *:font-extrabold tracking-wider text-white'>
              <th className='py-2 px-4 '>Nombre</th>
              <th className='py-2 px-4'>Correo</th>
              <th className='py-2 px-4'>Rol</th>
              <th className='py-2 px-4'>Created</th>
              <th className='py-2 px-4'></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
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
                  {user.created_at.toLocaleDateString()}
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
    </>
  )
}
