'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useSessionUser } from 'app/store/session-user'
import { useToaster } from 'app/context/ToasterContext'

export function AddExhibitor({ onExhibitorAdded }) {
  const t = useTranslations('ExhibitorsPage')

  const nationalities = [
    'Afghan',
    'Albanian',
    'Algerian',
    'American',
    'Andorran',
    'Angolan',
    'Argentine',
    'Armenian',
    'Australian',
    'Austrian',
    'Azerbaijani',
    'Bahamian',
    'Bahraini',
    'Bangladeshi',
    'Barbadian',
    'Belarusian',
    'Belgian',
    'Belizean',
    'Beninese',
    'Bhutanese',
    'Bolivian',
    'Bosnian',
    'Botswanan',
    'Brazilian',
    'British',
    'Bruneian',
    'Bulgarian',
    'Burkinabe',
    'Burmese',
    'Burundian',
    'Cambodian',
    'Cameroonian',
    'Canadian',
    'Cape Verdean',
    'Central African',
    'Chadian',
    'Chilean',
    'Chinese',
    'Colombian',
    'Comorian',
    'Congolese',
    'Costa Rican',
    'Croatian',
    'Cuban',
    'Cypriot',
    'Czech',
    'Danish',
    'Djiboutian',
    'Dominican',
    'Dutch',
    'Ecuadorian',
    'Egyptian',
    'Emirati',
    'Equatorial Guinean',
    'Eritrean',
    'Estonian',
    'Ethiopian',
    'Fijian',
    'Finnish',
    'French',
    'Gabonese',
    'Gambian',
    'Georgian',
    'German',
    'Ghanaian',
    'Greek',
    'Grenadian',
    'Guatemalan',
    'Guinean',
    'Guyanese',
    'Haitian',
    'Honduran',
    'Hungarian',
    'Icelandic',
    'Indian',
    'Indonesian',
    'Iranian',
    'Iraqi',
    'Irish',
    'Israeli',
    'Italian',
    'Ivorian',
    'Jamaican',
    'Japanese',
    'Jordanian',
    'Kazakh',
    'Kenyan',
    'Kuwaiti',
    'Kyrgyz',
    'Lao',
    'Latvian',
    'Lebanese',
    'Liberian',
    'Libyan',
    'Lithuanian',
    'Luxembourgish',
    'Malagasy',
    'Malawian',
    'Malaysian',
    'Malian',
    'Maltese',
    'Mauritanian',
    'Mauritian',
    'Mexican',
    'Moldovan',
    'Monacan',
    'Mongolian',
    'Montenegrin',
    'Moroccan',
    'Mozambican',
    'Namibian',
    'Nepalese',
    'New Zealander',
    'Nicaraguan',
    'Nigerian',
    'North Korean',
    'Norwegian',
    'Omani',
    'Pakistani',
    'Palestinian',
    'Panamanian',
    'Paraguayan',
    'Peruvian',
    'Philippine',
    'Polish',
    'Portuguese',
    'Qatari',
    'Romanian',
    'Russian',
    'Rwandan',
    'Salvadoran',
    'Saudi',
    'Scottish',
    'Senegalese',
    'Serbian',
    'Singaporean',
    'Slovak',
    'Slovenian',
    'Somali',
    'South African',
    'South Korean',
    'Spanish',
    'Sri Lankan',
    'Sudanese',
    'Swedish',
    'Swiss',
    'Syrian',
    'Taiwanese',
    'Tajik',
    'Tanzanian',
    'Thai',
    'Togolese',
    'Tunisian',
    'Turkish',
    'Turkmen',
    'Ukrainian',
    'Uruguayan',
    'Uzbek',
    'Venezuelan',
    'Vietnamese',
    'Welsh',
    'Yemeni',
    'Zambian',
    'Zimbabwean',
  ]

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    position: '',
    nationality: '',
  })

  const { userSession } = useSessionUser()
  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    const response = await fetch('/api/exhibitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userSession.id, ...formData }),
    })

    if (response.ok) {
      const newExhibitor = await response.json()
      
      if (onExhibitorAdded) {
        onExhibitorAdded(newExhibitor)
      }
      
      notify(t('toast.success'), 'success')
      handleClose()
      
      // Resetear formulario
      setFormData({
        name: '',
        lastname: '',
        email: '',
        position: '',
        nationality: '',
      })
    } else {
      notify(t('toast.error'), 'error')
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

                <div className='grid gap-4 md:grid-cols-[2fr,1fr]'>
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
                    {t('form.nationality')}
                  </label>
                  <select
                    name='nationality'
                    {...register('nationality', {
                      required: t('form.errors.required'),
                      onChange: handleChange,
                    })}
                    defaultValue={formData.nationality}
                    className='w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white ring-0 transition focus:border-blue-400/60 focus:outline-none *:text-slate-900'
                  >
                    <option value='' disabled>
                      {t('form.select')}
                    </option>
                    {nationalities.map((nation) => (
                      <option key={nation} value={nation}>
                        {nation}
                      </option>
                    ))}
                  </select>
                  {errors.nationality && (
                    <p className='text-sm text-rose-400'>
                      {errors.nationality.message}
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
