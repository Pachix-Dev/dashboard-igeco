'use client'

import { useToaster } from 'app/context/ToasterContext'
import { useSessionUser } from 'app/store/session-user'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function EditExhibitor({ exhibitor }) {
  const nationalities = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Argentine', 'Armenian', 'Australian', 'Austrian',
    'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese',
    'Bolivian', 'Bosnian', 'Botswanan', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian',
    'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian',
    'Comorian', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican',
    'Dutch', 'Ecuadorian', 'Egyptian', 'Emirati', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian',
    'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan',
    'Guinean', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi',
    'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakh', 'Kenyan', 'Kuwaiti', 'Kyrgyz',
    'Lao', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Lithuanian', 'Luxembourgish', 'Malagasy', 'Malawian', 'Malaysian',
    'Malian', 'Maltese', 'Mauritanian', 'Mauritian', 'Mexican', 'Moldovan', 'Monacan', 'Mongolian', 'Montenegrin',
    'Moroccan', 'Mozambican', 'Namibian', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'North Korean',
    'Norwegian', 'Omani', 'Pakistani', 'Palestinian', 'Panamanian', 'Paraguayan', 'Peruvian', 'Philippine', 'Polish',
    'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Salvadoran', 'Saudi', 'Scottish', 'Senegalese', 'Serbian',
    'Singaporean', 'Slovak', 'Slovenian', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese',
    'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tunisian', 'Turkish', 'Turkmen',
    'Ukrainian', 'Uruguayan', 'Uzbek', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemeni', 'Zambian', 'Zimbabwean'
  ];
  const { userSession } = useSessionUser()
  const [formData, setFormData] = useState({
    id: exhibitor.id,
    name: exhibitor.name,
    lastname: exhibitor.lastname,
    email: exhibitor.email,
    position: exhibitor.position,
    nationality: exhibitor.nationality
  })

  const [isOpen, setIsOpen] = useState(false)
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
    const response = await fetch(`/api/exhibitors/${formData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData }),
    })

    if (response.ok) {window.location.reload()
      notify('User Edit successfully', 'success')
      
    } else {
      notify('Failed to edit user', 'error')
    }

    handleClose()
  }

  return (
    <>
      {userSession?.role === 'admin' && (
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

          {isOpen && (
            <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10'>
              <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
                <h2 className='text-xl font-semibold mb-4'>Edit Exhibitor</h2>
                <form onSubmit={handleSubmit(handleUser)}>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Name</label>
                    <input
                      type='text'
                      {...register('name', {
                        required: 'Name is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.name}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.name && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Last Name </label>
                    <input
                      type='text'
                      {...register('lastname', {
                        required: 'Lastname is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.name}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.name && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Email</label>
                    <input
                      type='email'
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: 'Invalid email format',
                        },
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.email}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                 
                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Position</label>
                    <input
                      type='text'
                      name='position'
                      {...register('position', {
                        required: 'Position is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.position}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.position && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
  <label className='block text-[#f1f7feb5]'>Nationality</label>
  <select
    name='nationality'
    {...register('nationality', {
      required: 'Nationality is required',
      onChange: (e) => handleChange(e),
    })}
    defaultValue={formData.nationality}
    className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c] text-white'
  >
    <option value='' disabled>Select your nationality</option>
    {nationalities.map((nation, index) => (
      <option key={index} value={nation}>{nation}</option>
    ))}
  </select>
  {errors.nationality && (
    <p className='text-red-500 text-sm mt-1'>
      {errors.nationality.message}
    </p>
  )}
</div>

                  <div className='flex justify-end'>
                    <button
                      type='button'
                      onClick={handleClose}
                      className='mr-2 px-4 py-2 hover:bg-[#d9edfe25] text-white rounded-lg'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 bg-[#ffffffe6] hover:bg-[#ffffff] opacity-60 hover:opacity-100 text-black rounded-lg'
                    >
                      Edit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
