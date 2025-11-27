'use client'

import { useToaster } from '@/context/ToasterContext'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'

export function EditExhibitor({ exhibitor, onExhibitorUpdated }) {
  const t = useTranslations('ExhibitorsPage.edit')
  const [formData, setFormData] = useState({
    id: exhibitor.id,
    name: exhibitor.name,
    lastname: exhibitor.lastname,
    email: exhibitor.email,
    phone: exhibitor.phone,
    position: exhibitor.position,
    company: exhibitor.company,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const { notify } = useToaster()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/exhibitors/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      })

      if (response.ok) {
        const updatedExhibitor = {
          ...exhibitor,
          ...formData,
        }

        if (onExhibitorUpdated) {
          onExhibitorUpdated(updatedExhibitor)
        }

        notify(t('success'), 'success')
        handleClose()
      } else {
        notify(t('error'), 'error')
      }
    } catch (error) {
      notify(t('error'), 'error')
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
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
            <div className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-white mb-2'>
                  {t('title')}
                </h2>
                <p className='text-slate-400 text-sm'>{t('subtitle')}</p>
              </div>
              <form onSubmit={handleSubmit(handleUser)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-slate-300 text-sm font-medium mb-2'>
                      {t('name')}
                    </label>
                    <input
                      type='text'
                      {...register('name', {
                        required: t('nameRequired'),
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.name}
                      className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      placeholder={t('namePlaceholder')}
                    />
                    {errors.name && (
                      <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-slate-300 text-sm font-medium mb-2'>
                      {t('lastname')}
                    </label>
                    <input
                      type='text'
                      {...register('lastname', {
                        required: t('lastnameRequired'),
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.lastname}
                      className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      placeholder={t('lastnamePlaceholder')}
                    />
                    {errors.lastname && (
                      <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-slate-300 text-sm font-medium mb-2'>
                    {t('email')}
                  </label>
                  <input
                    type='email'
                    {...register('email', {
                      required: t('emailRequired'),
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: t('emailInvalid'),
                      },
                      onChange: (e) => handleChange(e),
                    })}
                    defaultValue={formData.email}
                    className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder={t('emailPlaceholder')}
                  />
                  {errors.email && (
                    <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-slate-300 text-sm font-medium mb-2'>
                    {t('phone')}
                  </label>
                  <input
                    type='tel'
                    {...register('phone', {
                      required: t('phoneRequired'),
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: t('phoneInvalid'),
                      },
                      onChange: (e) => handleChange(e),
                    })}
                    defaultValue={formData.phone}
                    className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    placeholder={t('phonePlaceholder')}
                  />
                  {errors.phone && (
                    <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-slate-300 text-sm font-medium mb-2'>
                      {t('position')}
                    </label>
                    <input
                      type='text'
                      name='position'
                      {...register('position', {
                        required: t('positionRequired'),
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.position}
                      className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      placeholder={t('positionPlaceholder')}
                    />
                    {errors.position && (
                      <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.position.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-slate-300 text-sm font-medium mb-2'>
                      {t('company')}
                    </label>
                    <input
                      type='text'
                      name='company'
                      {...register('company', {
                        required: t('companyRequired'),
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.company}
                      className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      placeholder={t('companyPlaceholder')}
                    />
                    {errors.company && (
                      <p className='text-red-400 text-xs mt-1.5 flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.company.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex gap-3 justify-end pt-6 border-t border-slate-700'>
                  <button
                    type='button'
                    onClick={handleClose}
                    disabled={isLoading}
                    className='px-6 py-2.5 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='px-6 py-2.5 rounded-lg font-medium text-slate-900 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className='animate-spin h-4 w-4'
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
                          />
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          />
                        </svg>
                        {t('saving')}
                      </>
                    ) : (
                      <>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                        {t('save')}
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
