'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useToaster } from '@/context/ToasterContext'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'
import type { Escenario, ProgramaDia, DiaForm } from '@/types/programa'
import { addDia, updateDia, deleteDia } from '@/lib/actions/programa'

interface Props {
  escenarios: Escenario[]
  dias: ProgramaDia[]
  onUpdate: (escenarioId?: number) => void
}

export function GestionDias({ escenarios, dias, onUpdate }: Props) {
  const t = useTranslations('ProgramaPage.dias')
  const tActions = useTranslations('ProgramaPage.actions')
  const tDelete = useTranslations('ProgramaPage.delete')
  const { notify } = useToaster()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDia, setEditingDia] = useState<ProgramaDia | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filterEscenario, setFilterEscenario] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DiaForm>()

  useEffect(() => {
    onUpdate(filterEscenario || undefined)
  }, [filterEscenario])

  const handleOpen = (dia?: ProgramaDia) => {
    if (dia) {
      setEditingDia(dia)
      reset(dia)
    } else {
      setEditingDia(null)
      reset({
        escenario_id: filterEscenario || escenarios[0]?.id || 0,
        date: '',
        name: '',
        description: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingDia(null)
    reset()
  }

  const onSubmit = async (data: DiaForm) => {
    setIsLoading(true)
    try {
      const result = editingDia
        ? await updateDia(editingDia.id, { ...data, active: editingDia.active })
        : await addDia(data)

      if (result?.success) {
        notify(t('toast.success'), 'success')
        handleClose()
        onUpdate(filterEscenario || undefined)
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
      const res = await deleteDia(id)
      if (res?.success) {
        notify(t('toast.deleteSuccess'), 'success')
        onUpdate(filterEscenario || undefined)
      } else {
        notify(t('toast.deleteError'), 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      notify(t('toast.deleteError'), 'error')
    }
  }

  const filteredDias = filterEscenario
    ? dias.filter(d => d.escenario_id === filterEscenario)
    : dias

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-white'>{t('title')}</h2>
          <p className='text-sm text-slate-400'>{t('subtitle')}</p>
        </div>
        <div className='grid md:flex gap-3'>
          <select
            value={filterEscenario || ''}
            onChange={(e) => setFilterEscenario(e.target.value ? Number(e.target.value) : null)}
            className='rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
          >
            <option value=''>{t('filters.allEscenarios')}</option>
            {escenarios.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
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
      </div>

      {/* Tabla */}
      <div className='overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-white/5'>
            <thead className='bg-white/5'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-semibold uppercase text-slate-300'>
                  {t('table.date')}
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold uppercase text-slate-300'>
                  {t('table.name')}
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold uppercase text-slate-300'>
                  {t('table.escenario')}
                </th>
                <th className='px-6 py-3 text-right text-xs font-semibold uppercase text-slate-300'>
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {filteredDias.length === 0 ? (
                <tr>
                  <td colSpan={4} className='px-6 py-8 text-center text-sm text-slate-400'>
                    {t('table.noData')}
                  </td>
                </tr>
              ) : (
                filteredDias.map((dia: any) => (
                  <tr key={dia.id} className='transition hover:bg-white/5'>
                    <td className='px-2 py-2 md:px-6 md:py-4'>
                      <div className='grid md:flex items-center gap-2'>
                        <svg className='h-5 w-5 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <span className='font-semibold text-white'>
                          {new Date(dia.date).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </td>
                    <td className='px-2 py-2 md:px-6 md:py-4'>
                      <span className='text-sm text-slate-300'>{dia.name || '-'}</span>
                    </td>
                    <td className='px-2 py-2 md:px-6 md:py-4'>
                      <span className='inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100'>
                        {dia.escenario_name}
                      </span>
                    </td>
                    <td className='px-2 py-2 md:px-6 md:py-4'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => handleOpen(dia)}
                          className='rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10'
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(dia.id)}
                          className='rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20'
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-950/80 p-4 backdrop-blur-sm'>
          <div className='relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl'>
            <div className='mb-6 flex items-start justify-between'>
              <h2 className='text-2xl font-bold text-white'>
                {editingDia ? t('edit') : t('add')}
              </h2>
              <button
                onClick={handleClose}
                className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
              >
                {tActions('close')}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.escenario')}
                  </label>
                  <select
                    {...register('escenario_id', { 
                      required: t('form.errors.required'),
                      valueAsNumber: true 
                    })}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                  >
                    <option value=''>{t('form.selectEscenario')}</option>
                    {escenarios.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                  {errors.escenario_id && (
                    <p className='text-sm text-rose-400'>{errors.escenario_id.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.date')}
                  </label>
                  <input
                    type='date'
                    {...register('date', { required: t('form.errors.required') })}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                  />
                  {errors.date && (
                    <p className='text-sm text-rose-400'>{errors.date.message}</p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('form.name')}
                </label>
                <input
                  type='text'
                  {...register('name')}
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                  placeholder={t('form.namePlaceholder')}
                />
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
