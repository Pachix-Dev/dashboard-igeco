'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSessionUser } from 'app/store/session-user'
import { useToaster } from 'app/context/ToasterContext'

export function AddPonentes() {
  
  const [formData, setFormData] = useState({
    name: '',
    lastname:'',
    companny:'',
    categoria:'',
    escenario:'',
    email: '',
    event:''
    
  })
  const { userSession } = useSessionUser()
  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    const response = await fetch('/api/ponentes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userSession.id, ...formData }),
    })

    if (response.ok) {
      notify('User Edit successfully', 'success')
    } else {
      notify('Failed to edit user', 'error')
    }

    handleClose()
  }

  return (
    <>
      {userSession?.role === 'admin' && (
        <>
          <button
            className='bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white'
            onClick={handleOpen}
          >
            + Agregar Ponente
          </button>

          {isOpen && (
            <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
              <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
                <h2 className='text-xl font-semibold mb-4'>
                  Add New Ponente
                </h2>
                <form onSubmit={handleSubmit(handleUser)}>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Name</label>
                    <input
                      type='text'
                      name='name'
                      {...register('name', {
                        required: 'Name is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.name}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.name && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Last name</label>
                    <input
                      type='text'
                      name='lastname'
                      {...register('lastname', {
                        required: 'Lastname is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.lastname}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.lastname && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Companny</label>
                    <input
                      type='text'
                      name='companny'
                      {...register('companny', {
                        required: 'Companny is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.companny}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.companny && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.companny.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Categoria</label>
                    <input
                      type='text'
                      name='categoria'
                      {...register('categoria', {
                        required: 'Categoria is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.categoria}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.categoria && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.categoria.message}
                      </p>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Escenario</label>
                    <input
                      type='text'
                      name='escenario'
                      {...register('escenario', {
                        required: 'Escenario is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.escenario}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.escenario && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.escenario.message}
                      </p>
                    )}
                  </div>




                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Email</label>
                    <input
                      type='email'
                      name='email'
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: 'Invalid email format',
                        },
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.email}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Event</label>
                    <input
                      type='text'
                      name='event'
                      {...register('event', {
                        required: 'Event is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.event}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.event && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.event.message}
                      </p>
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
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
