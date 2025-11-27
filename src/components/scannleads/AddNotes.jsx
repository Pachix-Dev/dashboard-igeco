'use client'

import { useToaster } from '@/context/ToasterContext'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function AddNotes({ lead, onUpdate }) {
  const t = useTranslations('ScanLeadsPage.notes')
  const [notes, setNotes] = useState(lead.notes)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { notify } = useToaster()
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/scanleads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: lead.uuid, notes }),
      })
      let data = {}
      try {
        data = await response.json()
      } catch (e) {
        // ignore parse errors
      }

      // Prefer logical status returned in the body (data.status)
      const logicalStatus =
        data?.status || (response.ok ? 200 : response.status)

      if (logicalStatus === 200) {
        notify(t('success'), 'success')
        // Actualizar el lead en el componente padre sin recargar
        if (onUpdate) {
          onUpdate(lead.uuid, notes)
        }
        handleClose()
      } else {
        notify(data?.message || t('error'), 'error')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      notify(t('error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='group relative flex justify-center'>
        <span className='pointer-events-none absolute -top-10 right-0 z-10 whitespace-nowrap rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100'>
          <span className='mr-1'>✨</span>
          {t('tooltip')}
        </span>
        <button
          onClick={handleOpen}
          className='group rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-2 text-emerald-400 transition hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5 transition group-hover:scale-110'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-500/20'>
            {/* Header con gradiente */}
            <div className='border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-5'>
              <div className='flex items-center gap-3'>
                <div className='rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg shadow-emerald-500/30'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={2}
                    stroke='currentColor'
                    className='h-6 w-6 text-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
                    />
                  </svg>
                </div>
                <div>
                  <h2 className='text-xl font-bold text-white'>{t('title')}</h2>
                  <p className='text-sm text-slate-400'>{t('subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleUser)} className='px-6 py-6'>
              {/* Info del Lead */}
              <div className='mb-6 rounded-2xl border border-white/10 bg-white/5 p-4'>
                <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>
                  {t('leadInfo')}
                </p>
                <p className='text-base font-medium text-white'>
                  {lead.name} {lead.paternSurname} {lead.maternSurname}
                </p>
                {lead.company && (
                  <p className='mt-1 flex items-center gap-2 text-sm text-slate-400'>
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
                        d='M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
                      />
                    </svg>
                    {lead.company}
                  </p>
                )}
              </div>

              {/* Textarea de notas */}
              <div className='mb-6'>
                <label className='mb-2 block text-sm font-semibold text-slate-300'>
                  {t('label')}
                </label>
                <textarea
                  {...register('notes', {
                    required: t('required'),
                    onChange: (e) => setNotes(e.target.value),
                  })}
                  defaultValue={lead.notes}
                  rows={5}
                  placeholder={t('placeholder')}
                  className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 shadow-inner shadow-black/20 transition focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'
                />
                {errors.notes && (
                  <p className='mt-2 flex items-center gap-1.5 text-sm text-red-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
                      />
                    </svg>
                    {errors.notes.message}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={handleClose}
                  disabled={isLoading}
                  className='flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {t('cancel')}
                </button>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg
                        className='h-5 w-5 animate-spin'
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
                      {t('saving')}
                    </span>
                  ) : (
                    t('save')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
