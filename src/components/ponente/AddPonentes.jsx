'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useTranslations} from 'next-intl'
import {useSessionUser} from 'app/store/session-user'
import {useToaster} from 'app/context/ToasterContext'

export function AddPonentes() {
  const t = useTranslations('SpeakersPage')
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    bio_esp: '',
    bio_eng: '',
    photo: '',
    email: '',
    phone: '',
    linkedin: '',
  })

  const {userSession} = useSessionUser()
  const [isOpen, setIsOpen] = useState(false)
  const {notify} = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleUser = async () => {
    try {
      const ponenteResponse = await fetch('/api/ponentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, photo: ''}),
      })

      const ponenteData = await ponenteResponse.json()

      if (!ponenteResponse.ok) {
        notify(t('toast.error'), 'error')
        return
      }

      const uuid = ponenteData.uuid
      let imagePath = ''

      if (formData.photo instanceof File) {
        const formDataFile = new FormData()
        formDataFile.append('image', formData.photo)
        formDataFile.append('uuid', uuid)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        })

        const uploadData = await uploadResponse.json()
        if (uploadResponse.ok) {
          imagePath = uploadData.path
        } else {
          notify(uploadData.error || t('toast.uploadError'), 'error')
          return
        }
      }

      await fetch('/api/ponentes/update-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uuid, photo: imagePath}),
      })

      notify(t('toast.success'), 'success')
      handleClose()
    } catch (error) {
      notify(t('toast.error'), 'error')
    }
  }

  if (userSession?.role !== 'admin') return null

  return (
    <>
      <button
        className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-rose-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60 focus:ring-offset-2 focus:ring-offset-slate-950"
        onClick={handleOpen}
      >
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/20 text-xs font-bold">+</span>
        <span>{t('cta.add')}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition">
          <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-purple-500/20">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{t('modal.title')}</h2>
                  <p className="text-sm text-slate-400">{t('modal.desc')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  {t('actions.close')}
                </button>
              </div>

              <form onSubmit={handleSubmit(handleUser)} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-200">{t('form.name')}</label>
                    <input
                      type="text"
                      name="name"
                      {...register('name', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.name}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder={t('form.namePlaceholder')}
                    />
                    {errors.name && <p className="text-sm text-rose-400">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">{t('form.company')}</label>
                    <input
                      type="text"
                      name="company"
                      {...register('company', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.company}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder={t('form.companyPlaceholder')}
                    />
                    {errors.company && <p className="text-sm text-rose-400">{errors.company.message}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-slate-200">{t('form.position')}</label>
                    <input
                      type="text"
                      name="position"
                      {...register('position', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                    defaultValue={formData.position}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder={t('form.positionPlaceholder')}
                    />
                    {errors.position && <p className="text-sm text-rose-400">{errors.position.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-slate-200">{t('form.linkedin')}</label>
                    <input
                      type="text"
                      name="linkedin"
                      {...register('linkedin', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.linkedin}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedin && <p className="text-sm text-rose-400">{errors.linkedin.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-slate-200">{t('form.phone')}</label>
                    <input
                      type="text"
                      name="phone"
                      {...register('phone', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.phone}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder="+52 ..."
                    />
                    {errors.phone && <p className="text-sm text-rose-400">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">{t('form.email')}</label>
                    <input
                      type="email"
                      name="email"
                      {...register('email', {
                        required: t('form.errors.required'),
                        pattern: {
                          value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: t('form.errors.email'),
                        },
                        onChange: handleChange,
                      })}
                      defaultValue={formData.email}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder={t('form.emailPlaceholder')}
                    />
                    {errors.email && <p className="text-sm text-rose-400">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">{t('form.upload')}</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">{t('form.bioEs')}</label>
                    <textarea
                      name="bio_esp"
                      {...register('bio_esp', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.bio_esp}
                      rows={4}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder={t('form.bioEsPlaceholder')}
                    ></textarea>
                    {errors.bio_esp && <p className="text-sm text-rose-400">{errors.bio_esp.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">{t('form.bioEn')}</label>
                    <textarea
                      name="bio_eng"
                      {...register('bio_eng', {
                        required: t('form.errors.required'),
                        onChange: handleChange,
                      })}
                      defaultValue={formData.bio_eng}
                      rows={4}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 ring-0 transition focus:border-fuchsia-400/60 focus:outline-none"
                      placeholder={t('form.bioEnPlaceholder')}
                    ></textarea>
                    {errors.bio_eng && <p className="text-sm text-rose-400">{errors.bio_eng.message}</p>}
                  </div>
                </div>

                {formData.photo && typeof formData.photo === 'string' && (
                  <div className="flex justify-center">
                    <img src={formData.photo} alt="Uploaded preview" className="mt-2 h-32 w-32 rounded-lg object-cover" />
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl border border-white/10 bg-white/0 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                  >
                    {t('actions.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-rose-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
