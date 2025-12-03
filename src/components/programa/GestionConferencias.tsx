'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useToaster } from '@/context/ToasterContext'
import { useForm, useFieldArray } from 'react-hook-form'
import { createPortal } from 'react-dom'
import type { Escenario, ProgramaDia, Conferencia, ConferenciaForm } from '@/types/programa'
import { addConferencia, updateConferencia, deleteConferencia, getConferencias, getConferenciaById } from '@/lib/actions/programa'

interface Props {
  escenarios: Escenario[]
  dias: ProgramaDia[]
  conferencias: Conferencia[]
  onUpdate: (diaId?: number) => void
}

interface Ponente {
  id: number
  name: string
  position?: string
  company?: string
}

export function GestionConferencias({ escenarios, dias, conferencias, onUpdate }: Props) {
  const t = useTranslations('ProgramaPage.conferencias')
  const tActions = useTranslations('ProgramaPage.actions')
  const tDelete = useTranslations('ProgramaPage.delete')
  const { notify } = useToaster()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConferencia, setEditingConferencia] = useState<Conferencia | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filterEscenario, setFilterEscenario] = useState<number | null>(null)
  const [filterDia, setFilterDia] = useState<number | null>(null)
  const [filteredDias, setFilteredDias] = useState<ProgramaDia[]>([])
  const [ponentes, setPonentes] = useState<Ponente[]>([])
  const [loadingPonentes, setLoadingPonentes] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ConferenciaForm>({
    defaultValues: {
      ponentes: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ponentes',
  })

  const selectedEscenario = watch('dia_id') 
    ? dias.find(d => d.id === Number(watch('dia_id')))?.escenario_id 
    : null

  useEffect(() => {
    if (filterEscenario) {
      const diasFiltrados = dias.filter(d => d.escenario_id === filterEscenario)
      setFilteredDias(diasFiltrados)
    } else {
      setFilteredDias(dias)
    }
  }, [filterEscenario, dias])

  useEffect(() => {
    onUpdate(filterDia || undefined)
  }, [filterDia])

  useEffect(() => {
    loadPonentes()
  }, [])

  const loadPonentes = async () => {
    setLoadingPonentes(true)
    try {
      const response = await fetch('/api/ponentes')
      const data = await response.json()    
      if (response.ok && data.ponentes) {
        setPonentes(data.ponentes)        
      } else {
        console.warn('⚠️ No se encontraron ponentes o error en respuesta')
      }
    } catch (error) {
      console.error('❌ Error al cargar ponentes:', error)
    } finally {
      setLoadingPonentes(false)
    }
  }

  const handleOpen = (conferencia?: Conferencia) => {
    if (conferencia) {
      setEditingConferencia(conferencia)
      // Cargar datos de la conferencia con sus ponentes
      loadConferenciaCompleta(conferencia.id)
    } else {
      setEditingConferencia(null)
      reset({
        dia_id: filterDia || undefined,
        title: '',
        title_eng: '',
        description: '',
        description_eng: '',
        start_time: '',
        end_time: '',
        room: '',
        type: 'presentation',        
        tags: [],
        ponentes: [],
      })
      setIsModalOpen(true)
    }
  }

  const loadConferenciaCompleta = async (id: number) => {
    try {
      const conf = await getConferenciaById(id)
      if (conf) {
        reset({
          dia_id: conf.dia_id,
          title: conf.title,
          title_eng: conf.title_eng || '',
          description: conf.description || '',
          description_eng: conf.description_eng || '',
          start_time: conf.start_time,
          end_time: conf.end_time,
          room: conf.room || '',
          type: conf.type,          
          tags: conf.tags || [],
          ponentes: conf.ponentes?.map((p: any) => ({
            ponente_id: p.ponente_id,
            role: p.role,
            order_index: p.order_index,
          })) || [],
        })
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error('Error:', error)
      notify(t('toast.error'), 'error')
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingConferencia(null)
    reset()
  }

  const onSubmit = async (data: ConferenciaForm) => {
    setIsLoading(true)
    try {
      if (editingConferencia) {
        await updateConferencia(editingConferencia.id, { active: editingConferencia.active, ...data } as any)
      } else {
        await addConferencia(data as any)
      }
        notify(t('toast.success'), 'success')
        handleClose()
        onUpdate(filterDia || undefined)
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
      await deleteConferencia(id)
        notify(t('toast.deleteSuccess'), 'success')
        onUpdate(filterDia || undefined)
    } catch (error) {
      console.error('Error:', error)
      notify(t('toast.deleteError'), 'error')
    }
  }

  const diasParaSelect = selectedEscenario
    ? dias.filter(d => d.escenario_id === selectedEscenario)
    : dias

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between overflow-x-auto'>
        <div>
          <h2 className='text-2xl font-bold text-white'>{t('title')}</h2>
          <p className='text-sm text-slate-400'>{t('subtitle')}</p>
        </div>
        <div className='grid md:flex gap-3'>
          <select
            value={filterEscenario || ''}
            onChange={(e) => {
              setFilterEscenario(e.target.value ? Number(e.target.value) : null)
              setFilterDia(null)
            }}
            className='rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
          >
            <option value=''>{t('filters.allEscenarios')}</option>
            {escenarios.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <select
            value={filterDia || ''}
            onChange={(e) => setFilterDia(e.target.value ? Number(e.target.value) : null)}
            className='rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
            disabled={!filterEscenario}
          >
            <option value=''>{t('filters.allDias')}</option>
            {filteredDias.map((d: any) => (
              <option key={d.id} value={d.id}>
                {new Date(d.date).toLocaleDateString('es-ES')} {d.name && `- ${d.name}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleOpen()}
            className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition'
          >
            <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            {t('add')}
          </button>
        </div>
      </div>

      {/* Lista de Conferencias */}
      <div className='space-y-4'>
        {conferencias.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-white/20 p-12 text-center'>
            <p className='text-slate-400'>{t('table.noData')}</p>
          </div>
        ) : (
          conferencias.map((conf: any) => (
            <div
              key={conf.id}
              className='rounded-2xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-blue-500/30'
            >
              <div className='grid md:flex gap-4 items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='text-lg font-bold text-white'>{conf.title}</h3>
                    <span className='rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-200'>
                      {conf.type}
                    </span>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-slate-400'>
                    <span className='flex items-center gap-1'>
                      <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      {conf.start_time} - {conf.end_time}
                    </span>
                    {conf.room && (
                      <span className='flex items-center gap-1'>
                        <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                        </svg>
                        {conf.room}
                      </span>
                    )}
                    {conf.total_ponentes > 0 && (
                      <span className='flex items-center gap-1'>
                        👥 {conf.total_ponentes} {t('table.ponentes')}
                      </span>
                    )}
                  </div>
                  {conf.description && (
                    <p className='mt-2 text-sm text-slate-400 line-clamp-2'>{conf.description}</p>
                  )}
                </div>
                <div className='flex gap-2'>
                  <button 
                    onClick={() => handleOpen(conf)}
                    className='rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10'
                  >
                    {t('edit')}
                  </button>
                  <button 
                    onClick={() => handleDelete(conf.id)}
                    className='rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20'
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
      
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='
          bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950  p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto'>
            <div className='mb-6 flex  items-start justify-between'>
              <h2 className='text-2xl font-bold text-white'>
                {editingConferencia ? t('edit') : t('add')}
              </h2>
              <button
                onClick={handleClose}
                className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
              >
                {tActions('close')}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              {/* Día */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('form.dia')} *
                </label>
                <select
                  {...register('dia_id', { 
                    required: t('form.errors.required'),
                    valueAsNumber: true 
                  })}
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                >
                  <option value=''>{t('form.selectDia')}</option>
                  {dias.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.escenario_name} - {new Date(d.date).toLocaleDateString('es-ES')} {d.name && `(${d.name})`}
                    </option>
                  ))}
                </select>
                {errors.dia_id && (
                  <p className='text-sm text-rose-400'>{errors.dia_id.message}</p>
                )}
              </div>

              {/* Título */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('form.title')} *
                </label>
                <input
                  type='text'
                  {...register('title', { required: t('form.errors.required') })}
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                  placeholder={t('form.titlePlaceholder')}
                />
                {errors.title && (
                  <p className='text-sm text-rose-400'>{errors.title.message}</p>
                )}
              </div>

              {/* Título en inglés */}
                <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                    {t('form.title')} eng*
                </label>
                <input
                    type='text'
                    {...register('title_eng', { required: t('form.errors.required') })}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                    placeholder={t('form.titlePlaceholder')}
                />                
                {errors.title_eng && (
                  <p className='text-sm text-rose-400'>{errors.title_eng.message}</p>
                )}
                </div>

              {/* Descripción */}
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

              {/* Descripción en inglés*/} 
                <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-200'>
                  {t('form.description')} eng
                </label>
                <textarea
                  {...register('description_eng')}
                  rows={3}
                  className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                  placeholder={t('form.descriptionPlaceholder')}
                />
              </div>

              {/* Horarios y Tipo */}
              <div className='grid gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.startTime')} *
                  </label>
                  <input
                    type='time'
                    {...register('start_time', { required: t('form.errors.required') })}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                  />
                  {errors.start_time && (
                    <p className='text-sm text-rose-400'>{errors.start_time.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.endTime')} *
                  </label>
                  <input
                    type='time'
                    {...register('end_time', { required: t('form.errors.required') })}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                  />
                  {errors.end_time && (
                    <p className='text-sm text-rose-400'>{errors.end_time.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.type')}
                  </label>
                  <select
                    {...register('type')}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                  >
                    <option value='presentation'>{t('form.types.presentation')}</option>
                    <option value='keynote'>{t('form.types.keynote')}</option>
                    <option value='panel'>{t('form.types.panel')}</option>
                    <option value='workshop'>{t('form.types.workshop')}</option>
                    <option value='networking'>{t('form.types.networking')}</option>
                    <option value='other'>{t('form.types.other')}</option>
                  </select>
                </div>
              </div>

              {/* Sala y Capacidad */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-200'>
                    {t('form.room')}
                  </label>
                  <input
                    type='text'
                    {...register('room')}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-blue-400/60 focus:outline-none'
                    placeholder={t('form.roomPlaceholder')}
                  />
                </div>

                
              </div>

              {/* Ponentes */}
              <div className='space-y-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-semibold text-blue-200'>
                    {t('form.ponentes.label')}
                  </label>
                  <button
                    type='button'
                    onClick={() => append({ ponente_id: 0, role: 'speaker', order_index: fields.length })}
                    className='rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/20'
                  >
                    + {t('form.ponentes.add')}
                  </button>
                </div>

                {loadingPonentes ? (
                  <p className='py-4 text-center text-sm text-slate-400'>
                    Cargando ponentes...
                  </p>
                ) : fields.length === 0 ? (
                  <p className='py-4 text-center text-sm text-slate-400'>
                    {t('form.ponentes.noData')}
                  </p>
                ) : (
                  <div className='space-y-3'>
                    {fields.map((field, index) => (
                      <div key={field.id} className='grid md:flex gap-3 rounded-lg border border-white/10 bg-slate-900/50 p-3'>
                        <div className='flex-1 space-y-3'>
                          <select
                            {...register(`ponentes.${index}.ponente_id` as const, {
                              required: t('form.ponentes.selectPonente'),
                              valueAsNumber: true,
                            })}
                            className='w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                            disabled={loadingPonentes}
                          >
                            <option value='0'>{t('form.ponentes.selectPonente')}</option>
                            {ponentes.length > 0 ? (
                              ponentes.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} {p.position && `- ${p.position}`} {p.company && `(${p.company})`}
                                </option>
                              ))
                            ) : (
                              <option value='0' disabled>No hay ponentes disponibles</option>
                            )}
                          </select>

                          <div className='grid grid-cols-2 gap-2'>
                            <select
                              {...register(`ponentes.${index}.role` as const)}
                              className='rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                            >
                              <option value='speaker'>{t('form.ponentes.roles.speaker')}</option>
                              <option value='moderator'>{t('form.ponentes.roles.moderator')}</option>
                              <option value='panelist'>{t('form.ponentes.roles.panelist')}</option>
                              <option value='guest'>{t('form.ponentes.roles.guest')}</option>
                            </select>

                            <input
                              type='number'
                              {...register(`ponentes.${index}.order_index` as const, { valueAsNumber: true })}
                              className='rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white transition focus:border-blue-400/60 focus:outline-none'
                              placeholder={t('form.ponentes.order')}
                              min='0'
                            />
                          </div>
                        </div>

                        <button
                          type='button'
                          onClick={() => remove(index)}
                          className='rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-xs font-semibold text-red-300 transition hover:bg-red-500/20'
                        >
                          {t('form.ponentes.remove')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones */}
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
