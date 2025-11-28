'use client'

import { useToaster } from '@/context/ToasterContext'
import { useSessionUser } from '@/store/session-user'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'

export function EditPonentes({ ponente, onPonenteUpdated }) {
  const { notify } = useToaster()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: ponente.id,
    name: ponente.speaker_name,
    position: ponente.position,
    company: ponente.company,
    bio_esp: ponente.bio_esp,
    bio_eng: ponente.bio_eng,
    photo: ponente.photo,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Crear URL temporal para preview
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, photo: file, previewUrl })
    }
  }

  const handleUser = async (data) => {
    setIsSubmitting(true)
    let imagePath = ponente.photo // Mantener la foto actual por defecto

    // Si hay un nuevo archivo seleccionado, subirlo
    if (formData.photo instanceof File) {
      const formDataFile = new FormData()
      formDataFile.append('image', formData.photo)
      formDataFile.append('uuid', ponente.uuid)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataFile,
      })

      const uploadData = await uploadResponse.json()
      if (uploadResponse.ok) {
        imagePath = uploadData.path
      } else {
        notify(uploadData.error || 'Error al subir la imagen', 'error')
        setIsSubmitting(false)
        return
      }
    }

    const response = await fetch(`/api/ponentes/${ponente.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, photo: imagePath }),
    })

    if (response.ok) {
      const updatedPonente = {
        ...ponente,
        speaker_name: data.name,
        position: data.position,
        company: data.company,
        bio_esp: data.bio_esp,
        bio_eng: data.bio_eng,
        photo: imagePath,
      }

      if (onPonenteUpdated) {
        onPonenteUpdated(updatedPonente)
      }

      notify('Ponente actualizado correctamente', 'success')
      handleClose()
    } else {
      notify('Error al actualizar el ponente', 'error')
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className='group relative h-9 w-9 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200'
        type='button'
        aria-label='Editar ponente'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-5 h-5 mx-auto text-blue-400 group-hover:text-blue-300 transition-all duration-200 group-hover:scale-110'
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
          <div className='absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition'>
            <div className='flex min-h-full items-center justify-center px-4 py-10'>
              <div className='w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-purple-500/20'>
                <div className='mb-6 flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>
                      Editar Ponente
                    </h2>
                    <p className='text-sm text-slate-400'>
                      Actualiza la información del ponente
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={handleClose}
                    className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
                  >
                    Cerrar
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(handleUser)}
                  className='p-6 overflow-y-auto '
                >
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* Columna izquierda */}
                    <div className='space-y-4'>
                      {/* Nombre */}
                      <div>
                        <label className='block text-sm font-semibold text-slate-300 mb-2'>
                          Nombre completo
                        </label>
                        <input
                          type='text'
                          {...register('name', {
                            required: 'El nombre es requerido',
                            onChange: (e) => handleChange(e),
                          })}
                          defaultValue={formData.name}
                          className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                          placeholder='Ej: Juan Pérez'
                        />
                        {errors.name && (
                          <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
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

                      {/* Cargo */}
                      <div>
                        <label className='block text-sm font-semibold text-slate-300 mb-2'>
                          Cargo / Puesto
                        </label>
                        <input
                          type='text'
                          {...register('position', {
                            required: 'El cargo es requerido',
                            onChange: (e) => handleChange(e),
                          })}
                          defaultValue={formData.position}
                          className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                          placeholder='Ej: Director de Marketing'
                        />
                        {errors.position && (
                          <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
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

                      {/* Empresa */}
                      <div>
                        <label className='block text-sm font-semibold text-slate-300 mb-2'>
                          Empresa
                        </label>
                        <input
                          type='text'
                          {...register('company', {
                            required: 'La empresa es requerida',
                            onChange: (e) => handleChange(e),
                          })}
                          defaultValue={formData.company}
                          className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                          placeholder='Ej: IGECO'
                        />
                        {errors.company && (
                          <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
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

                      {/* Foto */}
                      <div>
                        <label className='block text-sm font-semibold text-slate-300 mb-2'>
                          Foto del ponente
                        </label>
                        <div className='space-y-3'>
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

                          {(formData.previewUrl ||
                            (typeof formData.photo === 'string' &&
                              formData.photo)) && (
                            <div className='flex justify-center'>
                              <div className='relative group'>
                                {formData.previewUrl ? (
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
                                    src={
                                      formData.photo.startsWith('/')
                                        ? formData.photo
                                        : `/ponentes/${formData.photo}`
                                    }
                                    alt='Vista previa'
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
                      </div>
                    </div>

                    {/* Columna derecha */}
                    <div className='space-y-4'>
                      {/* Bio Español */}
                      <div>
                        <label className='block text-sm font-semibold text-slate-300 mb-2'>
                          Biografía (Español)
                        </label>
                        <textarea
                          {...register('bio_esp', {
                            required: 'La biografía en español es requerida',
                            onChange: (e) => handleChange(e),
                          })}
                          defaultValue={formData.bio_esp}
                          rows={6}
                          className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                          placeholder='Escribe la biografía en español...'
                        />
                        {errors.bio_esp && (
                          <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
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
                            {errors.bio_esp.message}
                          </p>
                        )}
                      </div>

                      {/* Bio Inglés */}
                      <div>
                        <label className='block text-sm font-semibold text-slate-300 mb-2'>
                          Biografía (Inglés)
                        </label>
                        <textarea
                          {...register('bio_eng', {
                            required: 'La biografía en inglés es requerida',
                            onChange: (e) => handleChange(e),
                          })}
                          defaultValue={formData.bio_eng}
                          rows={6}
                          className='w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                          placeholder='Write the biography in English...'
                        />
                        {errors.bio_eng && (
                          <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
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
                            {errors.bio_eng.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className='mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-800'>
                    <button
                      type='button'
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className='px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancelar
                    </button>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className='animate-spin h-5 w-5'
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
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='2'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M4.5 12.75l6 6 9-13.5'
                            />
                          </svg>
                          Guardar cambios
                        </>
                      )}
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
