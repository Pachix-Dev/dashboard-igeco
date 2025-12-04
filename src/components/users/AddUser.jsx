'use client'

import { useToaster } from '@/context/ToasterContext'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingOverlay } from '../shared/Loading'
import { createUserAction } from '@/lib/actions/users'

export function AddUser({ onUserCreated }) {
  const t = useTranslations('UsersPage')
  const locale = useLocale()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    showPassword: '',
    maxsessions: '',
    maxexhibitors: '',
    event: '',
    stand: '',
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    setIsLoading(true)
    try {
      const result = await createUserAction({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        password: formData.password,
        role: formData.role || undefined,
        maxsessions: formData.maxsessions,
        maxexhibitors: formData.maxexhibitors,
        event: formData.event,
        stand: formData.stand,
        locale,
      })

      if (result.success) {
        notify(result.message || t('toast.success'), 'success')

        if (result.emailStatus) {
          const level = result.emailStatus.success ? 'success' : 'warning'
          notify(result.emailStatus.message, level)
        }

        if (onUserCreated) {
          onUserCreated(result.data)
        }

        reset()
        setFormData({
          name: '',
          company: '',
          email: '',
          password: '',
          showPassword: false,
          role: '',
          maxsessions: '',
          maxexhibitors: '',
          event: '',
          stand: '',
        })

        setTimeout(() => {
          handleClose()
        }, 500)
      } else {
        notify(result.message || t('toast.error'), 'error')
        if (Array.isArray(result.errors)) {
          result.errors.forEach((errorMessage) => notify(errorMessage, 'error'))
        }
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
        <div className='absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition'>
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
                        onChange: handleChange,
                      })}
                      defaultValue={formData.name}
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
                      {t('form.company')}
                    </label>
                    <input
                      type='text'
                      name='company'
                      {...register('company', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.company}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder={t('form.companyPlaceholder')}
                    />
                    {errors.company && (
                      <p className='text-sm text-rose-400'>
                        {errors.company.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
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
                        onChange: handleChange,
                      })}
                      defaultValue={formData.email}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder={t('form.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className='text-sm text-rose-400'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.stand')}
                    </label>
                    <input
                      type='text'
                      name='stand'
                      {...register('stand', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.stand}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder={t('form.standPlaceholder')}
                      autoComplete='false'
                    />
                    {errors.stand && (
                      <p className='text-sm text-rose-400'>
                        {errors.stand.message}
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
                        type={formData.showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: t('form.errors.required'),
                          onChange: handleChange,
                          minLength: {
                            value: 6,
                            message: t('form.errors.passwordLength'),
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                            message: t('form.errors.passwordPattern'),
                          },
                        })}
                        defaultValue={formData.password}
                        className='w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200'
                        placeholder={t('form.passwordPlaceholder')}
                        autoComplete='new-password'
                      />

                      <button
                        type='button'
                        onClick={() =>
                          setFormData({
                            ...formData,
                            showPassword: !formData.showPassword,
                          })
                        }
                        className='absolute inset-y-0 right-2 flex items-center rounded-lg px-3 text-slate-400 transition hover:text-white focus:outline-none'
                      >
                        {formData.showPassword ? (
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
                      {t('form.event')}
                    </label>
                    <select
                      name='event'
                      {...register('event', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.event}
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

                <div className='grid gap-4 md:grid-cols-3'>
                  <div className='space-y-2'>
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
                          value: 1,
                          message: t('form.errors.exhibitorsMin'),
                        },
                        max: {
                          value: 100,
                          message: t('form.errors.exhibitorsMax'),
                        },
                        onChange: handleChange,
                      })}
                      defaultValue={formData.maxexhibitors}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder='1 - 100'
                    />
                    {errors.maxexhibitors && (
                      <p className='text-sm text-rose-400'>
                        {errors.maxexhibitors.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.sessions')}
                    </label>
                    <input
                      type='number'
                      name='maxsessions'
                      {...register('maxsessions', {
                        required: t('form.errors.required'),
                        pattern: {
                          value: /^[0-9]*$/,
                          message: t('form.errors.number'),
                        },
                        min: {
                          value: 0,
                          message: t('form.errors.sessionsMin'),
                        },
                        max: {
                          value: 100,
                          message: t('form.errors.sessionsMax'),
                        },
                        onChange: handleChange,
                      })}
                      defaultValue={formData.maxsessions}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder='0 - 100'
                    />
                    {errors.maxsessions && (
                      <p className='text-sm text-rose-400'>
                        {errors.maxsessions.message}
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
