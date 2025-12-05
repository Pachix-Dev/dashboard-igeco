'use client'
import { useToaster } from '@/context/ToasterContext'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingOverlay } from '../shared/Loading'
import { createPortal } from 'react-dom'
import { updateUserAction } from '@/lib/actions/users'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'

export function EditUser({ user, onUserUpdated }) {
  const t = useTranslations('UsersPage')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const [formData, setFormData] = useState({
    photo: null,
    previewUrl: null,
    show_directory: 0,
    status: 0,
  })
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const { notify } = useToaster()
  const locale = useLocale()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, photo: file, previewUrl })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      maxexhibitors: user.maxexhibitors,
      event: user.event,
      company: user.company,
      stand: user.stand,
      description: user.description || '',
      description_en: user.description_en || '',
      address: user.address || '',
      webpage: user.webpage || '',
      phone: user.phone || '',
      facebook: user.facebook || '',
      instagram: user.instagram || '',
      linkedin: user.linkedin || '',
      x: user.x || '',
      youtube: user.youtube || '',
      tiktok: user.tiktok || '',
    })
    setFormData({
      ...formData,
      show_directory: user.show_directory || 0,
      status: user.status || 0,
      previewUrl: user.photo ? `/logos/${user.photo}` : null,
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
      let photoPath = user.photo

      // Subir foto si existe
      if (formData.photo instanceof File) {
        const uploadFormData = new FormData()
        uploadFormData.append('image', formData.photo)
        uploadFormData.append('uuid', uuidv4())

        try {
          const res = await fetch('/api/upload/logo', {
            method: 'POST',
            body: uploadFormData,
          })
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            notify(err?.error || 'Error al subir el logo', 'error')
            setIsLoading(false)
            return
          }
          const resData = await res.json()
          photoPath = resData.path
        } catch (error) {
          notify('Error al subir el logo', 'error')
          setIsLoading(false)
          return
        }
      }

      const result = await updateUserAction({
        id: user.id,
        name: data.name,
        email: data.email,
        company: data.company,
        stand: data.stand,
        maxexhibitors: data.maxexhibitors,
        event: data.event,
        show_directory: formData.show_directory,
        status: formData.status,
        description: data.description || null,
        description_en: data.description_en || null,
        address: data.address || null,
        photo: photoPath,
        webpage: data.webpage || null,
        phone: data.phone || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        linkedin: data.linkedin || null,
        x: data.x || null,
        youtube: data.youtube || null,
        tiktok: data.tiktok || null,
        locale,
      })

      if (result.success) {
        notify(result.message || 'Usuario editado exitosamente', 'success')

        if (onUserUpdated) {
          onUserUpdated(result.data || { ...user, ...data })
        }

        setTimeout(() => {
          handleClose()
        }, 500)
      } else {
        notify(result.message || 'Error al editar el usuario', 'error')
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
              <div className='relative w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-blue-500/20'>
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

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.company')}
                      </label>
                      <input
                        type='text'
                        {...register('company', {
                          required: t('form.errors.required'),
                        })}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder={t('form.companyPlaceholder')}
                      />
                      {errors.company && (
                        <p className='text-sm text-rose-400'>
                          {errors.company.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.stand')}
                      </label>
                      <input
                        type='text'
                        {...register('stand', {
                          required: t('form.errors.required'),
                        })}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder={t('form.standPlaceholder')}
                      />
                      {errors.stand && (
                        <p className='text-sm text-rose-400'>
                          {errors.stand.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
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

                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        {t('form.exhibitors')}
                      </label>
                      <input
                        type='number'
                        {...register('maxexhibitors', {
                          required: t('form.errors.required'),
                          min: {
                            value: 1,
                            message: t('form.errors.exhibitorsMin'),
                          },
                          max: {
                            value: 100,
                            message: t('form.errors.exhibitorsMax'),
                          },
                        })}
                        className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                        placeholder='1 - 100'
                      />
                      {errors.maxexhibitors && (
                        <p className='text-sm text-rose-400'>
                          {errors.maxexhibitors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    {/* Toggle Switch Show Directory */}
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        Mostrar en Directorio
                      </label>
                      <div className='flex items-center gap-3 pt-2'>
                        <button
                          type='button'
                          onClick={() =>
                            setFormData({
                              ...formData,
                              show_directory:
                                formData.show_directory === 1 ? 0 : 1,
                            })
                          }
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            formData.show_directory === 1
                              ? 'bg-blue-500'
                              : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              formData.show_directory === 1
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className='text-sm text-slate-300'>
                          {formData.show_directory === 1 ? 'Sí' : 'No'}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Switch Status (Habilitar Cuenta) */}
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-slate-200'>
                        Habilitar Cuenta
                      </label>
                      <div className='flex items-center gap-3 pt-2'>
                        <button
                          type='button'
                          onClick={() =>
                            setFormData({
                              ...formData,
                              status: formData.status === 1 ? 0 : 1,
                            })
                          }
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            formData.status === 1
                              ? 'bg-green-500'
                              : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              formData.status === 1
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className='text-sm text-slate-300'>
                          {formData.status === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Campos Opcionales en Acordeón */}
                  <div className='border-t border-white/10 pt-4'>
                    <button
                      type='button'
                      onClick={() => setShowOptional(!showOptional)}
                      className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10'
                    >
                      <span className='text-sm font-semibold text-slate-200'>
                        Campos Opcionales (Información Adicional)
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2}
                        stroke='currentColor'
                        className={`h-5 w-5 text-slate-400 transition-transform ${
                          showOptional ? 'rotate-180' : ''
                        }`}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                        />
                      </svg>
                    </button>

                    {showOptional && (
                      <div className='mt-4 space-y-4 rounded-xl border border-white/10 bg-slate-900/30 p-4'>
                        {/* Logo Upload */}
                        <div className='space-y-3'>
                          <label className='text-sm font-semibold text-slate-200'>
                            Logo / Foto
                          </label>
                          <label className='flex items-center justify-center w-full px-4 py-3 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 hover:border-blue-500 transition-all group'>
                            <div className='flex flex-col items-center'>
                              <svg
                                className='w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                />
                              </svg>
                              <span className='mt-2 text-sm text-slate-400 group-hover:text-blue-400'>
                                Haz clic para subir una imagen
                              </span>
                            </div>
                            <input
                              type='file'
                              accept='image/png, image/jpeg, image/jpg, image/webp'
                              onChange={handleFileChange}
                              className='hidden'
                            />
                          </label>

                          {formData.previewUrl && (
                            <div className='flex justify-center'>
                              <div className='relative group'>
                                {formData.previewUrl.startsWith('blob:') ? (
                                  <Image
                                    src={formData.previewUrl}
                                    alt='Vista previa'
                                    className='w-32 h-32 object-cover rounded-xl border-2 border-slate-700'
                                    width={128}
                                    height={128}
                                    unoptimized
                                  />
                                ) : (
                                  <Image
                                    src={formData.previewUrl}
                                    alt='Logo actual'
                                    className='w-32 h-32 object-cover rounded-xl border-2 border-slate-700'
                                    width={128}
                                    height={128}
                                  />
                                )}
                                <div className='absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                  <span className='text-white text-xs'>
                                    Vista previa
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Descriptions */}
                        <div className='space-y-2'>
                          <label className='text-sm font-semibold text-slate-200'>
                            Descripción (Español)
                          </label>
                          <textarea
                            {...register('description')}
                            rows={3}
                            className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                            placeholder='Descripción de la empresa...'
                          />
                        </div>

                        <div className='space-y-2'>
                          <label className='text-sm font-semibold text-slate-200'>
                            Description (English)
                          </label>
                          <textarea
                            {...register('description_en')}
                            rows={3}
                            className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                            placeholder='Company description...'
                          />
                        </div>

                        {/* Contact Info */}
                        <div className='grid gap-4 md:grid-cols-2'>
                          <div className='space-y-2'>
                            <label className='text-sm font-semibold text-slate-200'>
                              Dirección
                            </label>
                            <input
                              type='text'
                              {...register('address')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='Calle, Ciudad, País'
                            />
                          </div>

                          <div className='space-y-2'>
                            <label className='text-sm font-semibold text-slate-200'>
                              Teléfono
                            </label>
                            <input
                              type='text'
                              {...register('phone')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='+52 123 456 7890'
                            />
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <label className='text-sm font-semibold text-slate-200'>
                            Sitio Web
                          </label>
                          <input
                            type='url'
                            {...register('webpage')}
                            className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                            placeholder='https://ejemplo.com'
                          />
                        </div>

                        {/* Social Media */}
                        <div className='space-y-3'>
                          <h4 className='text-sm font-semibold text-slate-300'>
                            Redes Sociales
                          </h4>
                          <div className='grid gap-3 md:grid-cols-2'>
                            <input
                              type='url'
                              {...register('facebook')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='Facebook URL'
                            />
                            <input
                              type='url'
                              {...register('instagram')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='Instagram URL'
                            />
                            <input
                              type='url'
                              {...register('linkedin')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='LinkedIn URL'
                            />
                            <input
                              type='url'
                              {...register('x')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='X (Twitter) URL'
                            />
                            <input
                              type='url'
                              {...register('youtube')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='YouTube URL'
                            />
                            <input
                              type='url'
                              {...register('tiktok')}
                              className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-blue-400/60 focus:outline-none'
                              placeholder='TikTok URL'
                            />
                          </div>
                        </div>
                      </div>
                    )}
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
