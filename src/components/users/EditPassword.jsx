'use client'
import { useToaster } from '@/context/ToasterContext'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'
import { updatePasswordAction } from '@/lib/actions/users'

export function EditPassword({ user }) {
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    setIsOpen(false)
    setPassword('')
    reset()
  }

  const [password, setPassword] = useState('')
  const { notify } = useToaster()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const handleUser = async () => {
    setIsLoading(true)
    try {
      const result = await updatePasswordAction({
        id: user.id,
        name: user.name,
        email: user.email,
        password,
        locale,
      })

      if (result.success) {
        notify(
          result.message || 'Contraseña actualizada correctamente',
          'success'
        )

        if (result.emailStatus) {
          const level = result.emailStatus.success ? 'success' : 'warning'
          notify(result.emailStatus.message, level)
        }
      } else {
        notify(result.message || 'Error al actualizar contraseña', 'error')
        if (Array.isArray(result.errors)) {
          result.errors.forEach((err) => notify(err, 'error'))
        }
      }
    } catch (error) {
      notify('Error de conexión. Intenta nuevamente', 'error')
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  return (
    <>
      {/* Botón trigger con tooltip mejorado */}
      <div className='group relative inline-flex'>
        <div className='absolute -top-10 right-0 scale-0 transition-all duration-200 rounded-xl bg-slate-800/95 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white shadow-xl group-hover:scale-100 whitespace-nowrap z-50 border border-slate-700/50'>
          <span className='flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
              />
            </svg>
            Enviar credenciales
          </span>
          <div className='absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-slate-800/95 border-r border-b border-slate-700/50'></div>
        </div>
        <button
          onClick={handleOpen}
          className='h-8 w-8 rounded-lg bg-transparent border border-slate-700/50 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 hover:border-blue-500/50 cursor-pointer transition-all duration-200 flex items-center justify-center'
          type='button'
          aria-label='Enviar credenciales'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z'
            />
          </svg>
        </button>
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className='fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200 overflow-auto'>
            <div className='bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200'>
              {/* Header */}
              <div className='relative p-6 border-b border-slate-700/50'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5 text-blue-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
                      />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-xl font-bold text-white'>
                      Enviar Credenciales
                    </h2>
                    <p className='text-sm text-slate-400 mt-0.5'>
                      Para: {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className='p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200'
                    type='button'
                    aria-label='Cerrar'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18 18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <form
                onSubmit={handleSubmit(handleUser)}
                className='p-6 space-y-5'
              >
                {/* Info box */}
                <div className='p-4 rounded-xl bg-blue-500/10 border border-blue-500/20'>
                  <div className='flex gap-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
                      />
                    </svg>
                    <div className='flex-1'>
                      <p className='text-sm text-blue-200 font-medium mb-1'>
                        Requisitos de seguridad
                      </p>
                      <ul className='text-xs text-blue-300/80 space-y-1'>
                        <li>• Mínimo 6 caracteres</li>
                        <li>• Al menos una mayúscula y una minúscula</li>
                        <li>• Al menos un número y un carácter especial</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Password input */}
                <div className='space-y-2'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-slate-300'
                  >
                    Nueva Contraseña
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'La contraseña es requerida',
                        onChange: (e) => setPassword(e.target.value),
                        minLength: {
                          value: 6,
                          message: 'Mínimo 6 caracteres',
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                          message: 'Debe cumplir los requisitos de seguridad',
                        },
                      })}
                      defaultValue={password}
                      className='w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200'
                      placeholder='Ingresa una contraseña segura'
                      autoComplete='new-password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-700/50'
                      aria-label={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-5 h-5'
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
                          className='w-5 h-5'
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
                    <div className='flex items-center gap-2 text-red-400 text-sm mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4 flex-shrink-0'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
                        />
                      </svg>
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className='flex gap-3 pt-2'>
                  <button
                    type='button'
                    onClick={handleClose}
                    disabled={isLoading}
                    className='flex-1 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className='animate-spin h-4 w-4'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-4 h-4'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                          />
                        </svg>
                        Enviar Credenciales
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
