'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useToaster } from '@/context/ToasterContext'
import { addExhibitor } from '@/lib/actions/exhibitors'

export function AddExhibitor({
  userId,
  onExhibitorAdded,
  maxExhibitors = 0,
  currentTotal = 0,
}) {
  const t = useTranslations('ExhibitorsPage')

  // Verificar si se alcanzó el límite o no tiene permiso
  const isLimitReached = currentTotal >= maxExhibitors
  const hasNoPermission = maxExhibitors === 0
  const isDisabled = hasNoPermission || isLimitReached

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    position: '',
    company: '',
  })

  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    try {
      const result = await addExhibitor({
        user_id: userId,
        ...formData,
      })

      if (result.success) {
        if (onExhibitorAdded) {
          onExhibitorAdded(result.data)
        }

        notify(t('toast.success'), 'success')
        handleClose()

        // Resetear formulario completamente
        const resetData = {
          name: '',
          lastname: '',
          email: '',
          phone: '',
          position: '',
          company: '',
        }
        setFormData(resetData)
        reset(resetData)
      } else {
        // Mostrar mensaje de error específico del servidor
        notify(result.error || t('toast.error'), 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      notify('Error de conexión. Por favor, intenta nuevamente.', 'error')
    }
  }

  return (
    <>
      <div className='group relative'>
        {isDisabled && (
          <div className='pointer-events-none absolute -top-12 right-0 z-10 whitespace-nowrap rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100'>
            {hasNoPermission ? (
              <span>🔒 {t('limit.noPermission')}</span>
            ) : (
              <span>
                ⚠️{' '}
                {t('limit.reached', {
                  current: currentTotal,
                  max: maxExhibitors,
                })}
              </span>
            )}
          </div>
        )}
        <button
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition focus:outline-none ${
            isDisabled
              ? 'cursor-not-allowed bg-slate-700 text-slate-400 opacity-50'
              : 'bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white shadow-blue-500/30 hover:scale-[1.01] focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-slate-950'
          }`}
          onClick={isDisabled ? undefined : handleOpen}
          disabled={isDisabled}
        >
          <span
            className={`grid h-6 w-6 place-items-center rounded-lg text-xs font-bold ${
              isDisabled ? 'bg-slate-600' : 'bg-white/20'
            }`}
          >
            +
          </span>
          <span>{t('cta.add')}</span>
        </button>
      </div>

      {isOpen && (
        <div className='absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition '>
          <div className='flex md:h-full items-center justify-center px-4'>
            <div className='w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 shadow-2xl shadow-blue-500/20'>
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
                      {t('form.lastname')}
                    </label>
                    <input
                      type='text'
                      name='lastname'
                      {...register('lastname', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.lastname}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder={t('form.lastnamePlaceholder')}
                    />
                    {errors.lastname && (
                      <p className='text-sm text-rose-400'>
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
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

                <div className='grid gap-4 md:grid-cols-[2fr,1fr]'>
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.phone')}
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      {...register('phone', {
                        required: t('form.errors.required'),
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: t('form.errors.phone'),
                        },
                        onChange: handleChange,
                      })}
                      defaultValue={formData.phone}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder={t('form.phonePlaceholder')}
                    />
                    {errors.phone && (
                      <p className='text-sm text-rose-400'>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-slate-200'>
                      {t('form.position')}
                    </label>
                    <input
                      type='text'
                      name='position'
                      {...register('position', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.position}
                      className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                      placeholder={t('form.positionPlaceholder')}
                    />
                    {errors.position && (
                      <p className='text-sm text-rose-400'>
                        {errors.position.message}
                      </p>
                    )}
                  </div>
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

                <div className='flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:justify-end'>
                  <button
                    type='button'
                    onClick={handleClose}
                    className='rounded-xl border border-white/10 bg-white/0 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5'
                  >
                    {t('actions.cancel')}
                  </button>
                  <button
                    type='submit'
                    className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-slate-950'
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
