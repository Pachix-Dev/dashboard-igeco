'use client'
import { useToaster } from 'app/context/ToasterContext'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingOverlay } from '../shared/Loading'
import { createPortal } from 'react-dom'

export function EditUser({ user, onUserUpdated }) {
  const t = useTranslations('UsersPage')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const { notify } = useToaster()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  const isExhibitorPlus = watch('role') === 'exhibitorplus'

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

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    const originalOverflow = document.body.style.overflow
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow || ''
    }
    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [isOpen])

  const handleUser = async (data) => {
    setIsLoading(true)
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

        // Cerrar modal después de un breve delay
        setTimeout(() => {
          handleClose()
        }, 500)
      } else {
        // Mostrar mensaje de error específico del servidor
        notify(responseData.message || 'Error al editar el usuario', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      notify('Error de conexión. Por favor, intenta nuevamente.', 'error')
    } finally {
      setIsLoading(false)
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

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition overflow-auto'>
            <div className='flex min-h-full items-center justify-center px-4 py-10'>
              <div className='relative w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-blue-500/20'>
                {isLoading && (
                  <LoadingOverlay message='Actualizando usuario...' />
                )}

                <div className='mb-6 flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>
                      {t('modal.editTitle')}
                    </h2>
                    <p className='text-sm text-slate-400'>
                      {t('modal.editDesc')}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={handleClose}
                    className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
                  >
                    {t('actions.close')}
                  </button>
                </div>

                <form onSubmit={handleSubmit(handleUser)} className='space-y-5'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.name')}
                      </label>
                      <input
                        type='text'
                        {...register('name', {
                          required: t('form.errors.required'),
                        })}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder={t('form.namePlaceholder')}
                      />
                      {errors.name && (
                        <p className='text-sm text-rose-400'>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.email')}
                      </label>
                      <input
                        type='email'
                        {...register('email', {
                          required: t('form.errors.required'),
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: t('form.errors.email'),
                          },
                        })}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder={t('form.emailPlaceholder')}
                      />
                      {errors.email && (
                        <p className='text-sm text-rose-400'>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.role')}
                    </label>
                    <select
                      {...register('role', {
                        required: t('form.errors.required'),
                      })}
                      className='mt-0 w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm text-white ring-0 transition focus:border-blue-400/60 focus:outline-none *:text-slate-900'
                    >
                      <option value='' disabled>
                        {t('form.select')}
                      </option>
                      <option value='exhibitor'>
                        {t('form.roles.exhibitor')}
                      </option>
                      <option value='exhibitorplus'>
                        {t('form.roles.exhibitorplus')}
                      </option>
                    </select>
                    {errors.role && (
                      <p className='text-sm text-rose-400'>
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <div className='grid gap-4 md:grid-cols-3'>
                    {isExhibitorPlus && (
                      <div className='space-y-2'>
                        <label className='text-sm font-semibold text-slate-200'>
                          {t('form.sessions')}
                        </label>
                        <input
                          type='number'
                          {...register('maxsessions', {
                            required: t('form.errors.required'),
                            min: {
                              value: 2,
                              message: t('form.errors.sessionsMin'),
                            },
                            max: {
                              value: 10,
                              message: t('form.errors.sessionsMax'),
                            },
                          })}
                          className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                          placeholder='2 - 10'
                        />
                        {errors.maxsessions && (
                          <p className='text-sm text-rose-400'>
                            {errors.maxsessions.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div
                      className={`space-y-2 ${isExhibitorPlus ? '' : 'md:col-span-2'}`}
                    >
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.exhibitors')}
                      </label>
                      <input
                        type='number'
                        {...register('maxexhibitors', {
                          required: t('form.errors.required'),
                          min: {
                            value: 2,
                            message: t('form.errors.exhibitorsMin'),
                          },
                          max: {
                            value: 10,
                            message: t('form.errors.exhibitorsMax'),
                          },
                        })}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder='2 - 10'
                      />
                      {errors.maxexhibitors && (
                        <p className='text-sm text-rose-400'>
                          {errors.maxexhibitors.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.event')}
                      </label>
                      <select
                        {...register('event', {
                          required: t('form.errors.required'),
                        })}
                        className='mt-0 w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm text-white ring-0 transition focus:border-blue-400/60 focus:outline-none *:text-slate-900'
                      >
                        <option value='' disabled>
                          {t('form.select')}
                        </option>
                        <option value='ECOMONDO'>ECOMONDO</option>
                        <option value='RE+ MEXICO'>RE+ MEXICO</option>
                      </select>
                      {errors.event && (
                        <p className='text-sm text-rose-400'>
                          {errors.event.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:justify-end'>
                    <button
                      type='button'
                      onClick={handleClose}
                      disabled={isLoading}
                      className='rounded-xl border border-white/10 bg-white/0 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {t('actions.cancel')}
                    </button>
                    <button
                      type='submit'
                      disabled={isLoading}
                      className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-4 w-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125'
                        />
                      </svg>
                      {t('actions.update')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
