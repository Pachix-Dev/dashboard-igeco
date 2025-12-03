'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useToaster } from '@/context/ToasterContext'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'
import type { Escenario, EscenarioForm } from '@/types/programa'
import { addEscenario, updateEscenario, deleteEscenario } from '@/lib/actions/programa'

interface Props {
  escenarios: Escenario[]
  onUpdate: () => void
}

export function GestionEscenarios({ escenarios, onUpdate }: Props) {
  const t = useTranslations('ProgramaPage.escenarios')
  const tActions = useTranslations('ProgramaPage.actions')
  const tDelete = useTranslations('ProgramaPage.delete')
  const { notify } = useToaster()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEscenario, setEditingEscenario] = useState<Escenario | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EscenarioForm>()

  const handleOpen = (escenario?: Escenario) => {
    if (escenario) {
      setEditingEscenario(escenario)
      reset(escenario)
    } else {
      setEditingEscenario(null)
      reset({
        name: '',
        description: '',
        location: '',
        capacity: undefined,
      })
    }
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingEscenario(null)
    reset()
  }

  const onSubmit = async (data: EscenarioForm) => {
    setIsLoading(true)
    try {
      const result = editingEscenario
        ? await updateEscenario(editingEscenario.id, { ...data, active: editingEscenario.active })
        : await addEscenario(data)

      if (result?.success) {
        notify(t('toast.success'), 'success')
        handleClose()
        onUpdate()
      } else {
        notify(result?.error || t('toast.error'), 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      notify(t('toast.error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(tDelete('message'))) return

    try {
      const res = await deleteEscenario(id)
      if (res?.success) {
        notify(t('toast.deleteSuccess'), 'success')
        onUpdate()
      } else {
        notify(t('toast.deleteError'), 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      notify(t('toast.deleteError'), 'error')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='grid md:flex gap-2 items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-white'>{t('title')}</h2>
          <p className='text-sm text-slate-400'>{t('subtitle')}</p>
        </div>
        <button
          onClick={() => handleOpen()}
          className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.02]'
        >
          <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          {t('add')}
        </button>
      </div>

      {/* Lista de Escenarios */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {escenarios.map((escenario) => (
          <div
            key={escenario.id}
            className='rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-lg transition hover:border-blue-500/30 hover:shadow-blue-500/10'
          >
            <div className='mb-4 flex items-start justify-between'>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-white'>{escenario.name}</h3>
                {escenario.location && (
                  <p className='mt-1 flex items-center gap-1 text-sm text-slate-400'>
                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    {escenario.location}
                  </p>
                )}
              </div>
              {escenario.capacity && (
                <span className='rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-slate-300'>
                  {escenario.capacity} 👥
                </span>
              )}
            </div>

            {escenario.description && (
              <p className='mb-4 text-sm text-slate-400 line-clamp-2'>{escenario.description}</p>
            )}

            <div className='flex gap-2'>
              <button
                onClick={() => handleOpen(escenario)}
                className='flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10'
              >
                {t('edit')}
              </button>
              <button
                onClick={() => handleDelete(escenario.id)}
                className='rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20'
              >
                {t('delete')}
              </button>
            </div>
          </div>
        ))}

        {escenarios.length === 0 && (
          <div className='col-span-full rounded-2xl border border-dashed border-white/20 p-12 text-center'>
            <p className='text-slate-400'>{t('table.noData')}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-950/80 p-4 backdrop-blur-sm'>
          <div className='relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl'>
            <div className='mb-6 flex items-start justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-white'>
                  {editingEscenario ? t('edit') : t('add')}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
              >
                {tActions('close')}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('form.name')}
                </label>
                <input
                  type='text'
                  {...register('name', { required: t('form.errors.required') })}
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                  placeholder={t('form.namePlaceholder')}
                />
                {errors.name && (
                  <p className='text-sm text-rose-400'>{errors.name.message}</p>
                )}
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.location')}
                  </label>
                  <input
                    type='text'
                    {...register('location')}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                    placeholder={t('form.locationPlaceholder')}
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.capacity')}
                  </label>
                  <input
                    type='number'
                    {...register('capacity', { valueAsNumber: true })}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                    placeholder={t('form.capacityPlaceholder')}
                    min='1'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('form.description')}
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                  placeholder={t('form.descriptionPlaceholder')}
                />
              </div>

              <div className='flex gap-3 border-t border-white/10 pt-6'>
                <button
                  type='button'
                  onClick={handleClose}
                  disabled={isLoading}
                  className='flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50'
                >
                  {tActions('cancel')}
                </button>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='flex-1 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] disabled:opacity-50'
                >
                  {isLoading ? tActions('saving') : tActions('save')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
