'use client'

import { useToaster } from 'app/context/ToasterContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function AddUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('')
  const [maxsessions, setMaxsessions] = useState('')
  const [maxexhibitors, setMaxexhibitors] = useState('')
  const [event, setevent] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleUser = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        maxsessions,
        maxexhibitors,
        event,
      }),
    })

    if (response.ok) {
      notify('User Edit successfully', 'success')
      // Enviar correo electrónico con las credenciales

      const sendResponse = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      })

      if (sendResponse.status) {
        notify(sendResponse.message, 'success')
      } else {
        notify(sendResponse.message, 'error')
      }
    } else {
      notify('Failed to edit user', 'error')
    }

    handleClose()
  }
  return (
    <>
      <button
        className='bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white'
        onClick={handleOpen}
      >
        + Agregar Usuario
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold mb-4'>Add New User</h2>
            <form onSubmit={handleSubmit(handleUser)}>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Company name</label>
                <input
                  type='text'
                  {...register('name', {
                    required: 'Name is required',
                    onChange: (e) => setName(e.target.value),
                  })}
                  defaultValue={name}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.name.message}
                  </p>
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
                    onChange: (e) => setEmail(e.target.value),
                  })}
                  defaultValue={email}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Password</label>
                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      onChange: (e) => setPassword(e.target.value),
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                        message: 'Password must contain letters and numbers',
                      },
                    })}
                    defaultValue={password}
                    className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    placeholder='••••••••••••'
                    autoComplete='off'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500'
                  >
                    {showPassword ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Tipo de perfil</label>
                <select
                  {...register('role', {
                    required: 'Role is required',
                    onChange: (e) => setRole(e.target.value),
                  })}
                  defaultValue={role}
                  className='mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-white *:text-black'
                >
                  <option value='' disabled>
                    Selecciona una opción
                  </option>
                  <option value='exhibitor'>Expositor</option>
                  <option value='exhibitorplus'>Expositor + Scanner</option>
                </select>
                {errors.role && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div className='mb-4'>
                {role === 'exhibitorplus' && (
                  <>
                    <label className='block text-[#f1f7feb5]'>
                      Max Sessions
                    </label>
                    <input
                      type='number'
                      {...register('sessions', {
                        required: 'Sessions is required',
                        pattern: {
                          value: /^[0-9]*$/,
                          message: 'Invalid sessions format',
                        },
                        min: {
                          value: 2,
                          message: 'Sessions must be at least 2',
                        },
                        max: {
                          value: 10,
                          message: 'Sessions maximum is 10',
                        },
                        onChange: (e) => setMaxsessions(e.target.value),
                      })}
                      defaultValue={maxsessions}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.sessions && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.sessions.message}
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>
                  Max Exbhibitors
                </label>
                <input
                  type='number'
                  {...register('maxexhibitors', {
                    required: 'Exhibitos is required',
                    pattern: {
                      value: /^[0-9]*$/,
                      message: 'Invalid sessions format',
                    },
                    min: {
                      value: 2,
                      message: 'Exhibitors must be at least 2',
                    },
                    max: {
                      value: 10,
                      message: 'Exhibitos maximum is 10',
                    },
                    onChange: (e) => setMaxexhibitors(e.target.value),
                  })}
                  defaultValue={maxexhibitors}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                />
                {errors.maxexhibitors && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.maxexhibitors.message}
                  </p>
                )}
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Tipo de evento</label>
                <select
                  {...register('event', {
                    required: 'Event is required',
                    onChange: (e) => setevent(e.target.value),
                  })}
                  defaultValue={event}
                  className='mt-2 w-full rounded-lg bg-transparent border border-gray-200 p-4 pe-12 text-sm text-white *:text-black'
                >
                  <option value='' disabled>
                    Selecciona una opción
                  </option>
                  <option value='Ecomondo'>Ecomondo</option>
                  <option value='Replus'>Replus</option>
                </select>
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
  )
}
