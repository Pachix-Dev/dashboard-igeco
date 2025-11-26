'use client'

import { useToaster } from 'app/context/ToasterContext'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingOverlay } from '../shared/Loading'

export function AddUser({ onUserAdded }) {
  const t = useTranslations('UsersPage')
  const locale = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('')
  const [maxsessions, setMaxsessions] = useState('')
  const [maxexhibitors, setMaxexhibitors] = useState('')
  const [event, setevent] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { notify } = useToaster()

  const isExhibitorPlus = role === 'exhibitorplus'

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          company,
          email,
          password,
          role,
          maxsessions,
          maxexhibitors,
          event,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        notify(data.message || t('toast.success'), 'success')

        // Enviar email de bienvenida
        try {
          const sendResponse = await fetch('/api/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password, locale }),
          })

          const sendData = await sendResponse.json()
          if (sendResponse.ok) {
            notify(
              'Usuario creado y email de bienvenida enviado exitosamente',
              'success'
            )
          } else {
            notify('Usuario creado, pero no se pudo enviar el email', 'warning')
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError)
          notify('Usuario creado, pero no se pudo enviar el email', 'warning')
        }

        // Crear objeto del nuevo usuario para agregar a la lista
        const newUser = {
          id: data.id || Date.now(), // ID temporal si no viene del servidor
          name,
          company,
          email,
          role,
          maxsessions: maxsessions || 1,
          maxexhibitors: maxexhibitors || 1,
          event,
        }

        // Notificar al componente padre
        if (onUserAdded) {
          onUserAdded(newUser)
        }

        // Resetear formulario completamente
        reset()
        setName('')
        setCompany('')
        setEmail('')
        setPassword('')
        setRole('')
        setMaxsessions('')
        setMaxexhibitors('')
        setevent('')

        // Cerrar modal después de un breve delay para que el usuario vea el éxito
        setTimeout(() => {
          handleClose()
        }, 500)
      } else {
        // Mostrar mensaje de error específico del servidor
        notify(data.message || t('toast.error'), 'error')
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
        className='group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-slate-950'
        onClick={handleOpen}
      >
        <span className='grid h-6 w-6 place-items-center rounded-lg bg-white/20 text-xs font-bold'>
          +
        </span>
        <span>{t('cta.add')}</span>
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition'>
          <div className='flex min-h-full items-center justify-center px-4 py-10'>
            <div className='relative w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-blue-500/20'>
              {isLoading && <LoadingOverlay message='Creando usuario...' />}
              <div className='mb-6 flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-2xl font-bold text-white'>
                    {t('modal.title')}
                  </h2>
                  <p className='text-sm text-slate-400'>{t('modal.desc')}</p>
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
                      name='name'
                      {...register('name', {
                        required: t('form.errors.required'),
                        onChange: (e) => setName(e.target.value),
                      })}
                      defaultValue={name}
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
                      name='email'
                      {...register('email', {
                        required: t('form.errors.required'),
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: t('form.errors.email'),
                        },
                        onChange: (e) => setEmail(e.target.value),
                      })}
                      defaultValue={email}
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

                <div className='grid gap-4 md:grid-cols-[2fr,1fr]'>
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.password')}
                    </label>
                    <div className='relative'>
                      <input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        {...register('password', {
                          required: t('form.errors.required'),
                          onChange: (e) => setPassword(e.target.value),
                          minLength: {
                            value: 6,
                            message: t('form.errors.passwordLength'),
                          },
                          pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                            message: t('form.errors.passwordPattern'),
                          },
                        })}
                        defaultValue={password}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder={t('form.passwordPlaceholder')}
                        autoComplete='off'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-2 flex items-center rounded-lg px-3 text-slate-400 transition hover:text-white focus:outline-none'
                      >
                        {showPassword ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='h-5 w-5'
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
                            className='h-5 w-5'
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
                      <p className='text-sm text-rose-400'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.role')}
                    </label>
                    <select
                      name='role'
                      {...register('role', {
                        required: t('form.errors.required'),
                        onChange: (e) => setRole(e.target.value),
                      })}
                      defaultValue={role}
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
                </div>

                <div className='grid gap-4 md:grid-cols-3'>
                  {isExhibitorPlus && (
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.sessions')}
                      </label>
                      <input
                        type='number'
                        name='sessions'
                        {...register('sessions', {
                          required: t('form.errors.required'),
                          pattern: {
                            value: /^[0-9]*$/,
                            message: t('form.errors.number'),
                          },
                          min: {
                            value: 2,
                            message: t('form.errors.sessionsMin'),
                          },
                          max: {
                            value: 10,
                            message: t('form.errors.sessionsMax'),
                          },
                          onChange: (e) => setMaxsessions(e.target.value),
                        })}
                        defaultValue={maxsessions}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder='2 - 10'
                      />
                      {errors.sessions && (
                        <p className='text-sm text-rose-400'>
                          {errors.sessions.message}
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
                      name='maxexhibitors'
                      {...register('maxexhibitors', {
                        required: t('form.errors.required'),
                        pattern: {
                          value: /^[0-9]*$/,
                          message: t('form.errors.number'),
                        },
                        min: {
                          value: 2,
                          message: t('form.errors.exhibitorsMin'),
                        },
                        max: {
                          value: 10,
                          message: t('form.errors.exhibitorsMax'),
                        },
                        onChange: (e) => setMaxexhibitors(e.target.value),
                      })}
                      defaultValue={maxexhibitors}
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
                      name='event'
                      {...register('event', {
                        required: t('form.errors.required'),
                        onChange: (e) => setevent(e.target.value),
                      })}
                      defaultValue={event}
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
                        d='M12 4.5v15m7.5-7.5h-15'
                      />
                    </svg>
                    {t('actions.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
