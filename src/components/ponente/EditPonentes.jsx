'use client'

import { useToaster } from 'app/context/ToasterContext'
import { useSessionUser } from 'app/store/session-user'
import { useState } from 'react'
import { useForm } from 'react-hook-form'


export function EditPonentes({ ponente }) {
  const { userSession } = useSessionUser()
  const { notify } = useToaster();
  const [isOpen, setIsOpen] = useState(false) // Estado para controlar el modal
  const [formData, setFormData] = useState({
    id: ponente.id,
    name: ponente.speaker_name,
    position: ponente.position,
    company: ponente.company,  
    bio_esp: ponente.bio_esp,
    bio_eng: ponente.bio_eng,
    photo: ponente.photo,
    linkedin: ponente.linkedin,
    email: ponente.email,
    phone: ponente.phone,
  })

  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] }) // Guardar archivo temporalmente
  }

  const handleUser = async (data) => {
    let imagePath = data.photo;
  
    if (data.photo instanceof File) {
      const formDataFile = new FormData();
      formDataFile.append('image', data.photo);
      formDataFile.append('uuid', ponente.uuid);
  
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataFile,
      });
  
      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        imagePath = uploadData.path;
      } else {
        notify(uploadData.error || 'Image upload failed', 'error');
        return;
      }
    }
  
    const response = await fetch(`/api/ponentes/${ponente.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, photo: imagePath }),
    });
  
    if (response.ok) {
      window.location.reload();
      notify('User edited successfully', 'success');
    } else {
      notify('Failed to edit user', 'error');
    }
  
    handleClose();
  };
  

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
                    <label className='block text-[#f1f7feb5]'>Position</label>
                    <input
                      type='text'
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
                    <label className='block text-[#f1f7feb5]'>Company</label>
                    <input
                      type='text'
                      {...register('company', {
                        required: 'Company is required',  // Corregido 'companny' a 'company'
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.company}  // Corregido 'companny' a 'company'
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.company && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Bio (Spanish)</label>
                    <textarea
                      {...register('bio_esp', {
                        required: 'Bio in Spanish is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.bio_esp}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.bio_esp && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.bio_esp.message}
                      </p>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Bio (English)</label>
                    <textarea
                      {...register('bio_eng', {
                        required: 'Bio in English is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.bio_eng}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.bio_eng && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.bio_eng.message}
                      </p>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>LinkedIn URL</label>
                    <input
                      type='url'
                      {...register('linkedin', {
                        required: 'LinkedIn URL is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.linkedin}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.linkedin && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.linkedin.message}
                      </p>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Upload New Image</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c] text-white"
                    />
                  </div>

                  {typeof formData.photo === "string" && (
                    <div className="mb-4 flex justify-center">
                      <img src={formData.photo} alt="Uploaded preview" className="w-32 h-32 object-cover rounded-lg mt-2" />
                    </div>
                  )}

                  <div className='mb-4'>
                    <label className='block text-[#f1f7feb5]'>Email</label>
                    <input
                      type='email'
                      {...register('email', {
                        required: 'Email is required',
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
                    <label className='block text-[#f1f7feb5]'>Phone</label>
                    <input
                      type='tel'
                      {...register('phone', {
                        required: 'Phone number is required',
                        onChange: (e) => handleChange(e),
                      })}
                      defaultValue={formData.phone}
                      className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                    />
                    {errors.phone && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.phone.message}
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
