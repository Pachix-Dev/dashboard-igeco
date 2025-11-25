'use client'
import { useToaster } from 'app/context/ToasterContext'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export function EditUser({ user, onUserUpdated }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const { notify } = useToaster()
  // Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Para actualizar valores del formulario
    watch, // Para leer valores en tiempo real
  } = useForm()
  // Resetear el formulario cuando user cambie
  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      maxsessions: user.maxsessions,
      maxexhibitors: user.maxexhibitors,
      event: user.event,
    })
  }, [user, reset])
  const handleUser = async (data) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        notify(
          responseData.message || 'Usuario editado exitosamente',
          'success'
        )

        // Notificar al componente padre con los datos actualizados
        if (onUserUpdated) {
          onUserUpdated({ ...user, ...data })
        }

        handleClose()
      } else {
        // Mostrar mensaje de error específico del servidor
        notify(responseData.message || 'Error al editar el usuario', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      notify('Error de conexión. Por favor, intenta nuevamente.', 'error')
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className='h-6 w-6 rounded bg-transparent border-none text-slate-11 hover:bg-slate-5 cursor-pointer align-middle'
        type='button'
        aria-label='More actions'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:rotate-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10'>
          <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold mb-4'>Edit User</h2>
            <form onSubmit={handleSubmit(handleUser)}>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Company Name</label>
                <input
                  type='text'
                  {...register('name', { required: 'Name is required' })}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#0e0b0b]'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Email</label>
                <input
                  type='email'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email format',
                    },
                  })}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c]'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>

              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Tipo de perfil</label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className='mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 text-sm bg-white text-black'
                >
                  <option value='' disabled>
                    Selecciona una opción
                  </option>
                  <option value='exhibitor'>Expositor</option>
                  <option value='exhibitorplus'>Expositor + Scanner</option>
                </select>
                {errors.role && (
                  <p className='text-red-500 text-sm'>{errors.role.message}</p>
                )}
              </div>

              {watch('role') === 'exhibitorplus' && (
                <div className='mb-4'>
                  <label className='block text-[#f1f7feb5]'>Max Sessions</label>
                  <input
                    type='number'
                    {...register('maxsessions', {
                      required: 'Sessions is required',
                      min: { value: 2, message: 'Sessions must be at least 2' },
                      max: { value: 10, message: 'Sessions max is 10' },
                    })}
                    className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c]'
                  />
                  {errors.maxsessions && (
                    <p className='text-red-500 text-sm'>
                      {errors.maxsessions.message}
                    </p>
                  )}
                </div>
              )}

              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Max Exhibitors</label>
                <input
                  type='number'
                  {...register('maxexhibitors', {
                    required: 'Exhibitors is required',
                    min: { value: 2, message: 'Exhibitors must be at least 2' },
                    max: { value: 10, message: 'Exhibitors max is 10' },
                  })}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c]'
                />
                {errors.maxexhibitors && (
                  <p className='text-red-500 text-sm'>
                    {errors.maxexhibitors.message}
                  </p>
                )}
              </div>

              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Tipo de evento</label>
                <select
                  {...register('event', { required: 'Event is required' })}
                  className='mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 text-sm text-white'
                >
                  <option value='' disabled>
                    Selecciona una opción
                  </option>
                  <option value='Ecomondo'>Ecomondo</option>
                  <option value='Replus'>Replus</option>
                </select>
                {errors.event && (
                  <p className='text-red-500 text-sm'>{errors.event.message}</p>
                )}
              </div>

              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={handleClose}
                  className='mr-2 px-4 py-2 hover:bg-[#d9edfe25] text-white rounded-lg'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-[#ffffffe6] hover:bg-[#ffffff] opacity-60 hover:opacity-100 text-black rounded-lg'
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
