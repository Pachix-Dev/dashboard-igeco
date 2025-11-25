'use client'
import { useToaster } from 'app/context/ToasterContext'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function EditPassword({ user }) {
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const [password, setPassword] = useState('')
  const { notify } = useToaster()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleUser = async () => {
    const response = await fetch(`/api/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, password }),
    })

    if (response.ok) {
      notify('User Edit successfully', 'success')
      const send = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password,
          locale,
        }),
      })
      const sendResponse = await send.json()
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
      <div className='group relative flex justify-center'>
        <span className='absolute top-[-5px] right-12 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100'>
          📨 Enviar credenciales
        </span>
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
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z'
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10'>
          <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold mb-4'>Send Credentials</h2>
            <form onSubmit={handleSubmit(handleUser)}>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>
                  Enter New Password
                </label>
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
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
