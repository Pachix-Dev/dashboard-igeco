'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSessionUser } from 'app/store/session-user'
import { useToaster } from 'app/context/ToasterContext'

export function AddPonentes() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    companny: '',
    categoria: '',
    escenario: '',
    email: '',
    event: ''
  })
  
  const { userSession } = useSessionUser()
  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    const response = await fetch('/api/ponentes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: userSession.id, ...formData })
    })

    if (response.ok) {
      notify('User added successfully', 'success')
    } else {
      notify('Failed to add user', 'error')
    }

    handleClose()
  }

  return (
    <>
      {userSession?.role === 'admin' && (
        <>
          <button
            className='bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white'
            onClick={handleOpen}
          >
            + Agregar Ponente
          </button>

          {isOpen && (
            <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
              <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-full max-w-3xl'>
                <h2 className='text-xl font-semibold mb-4 text-white'>
                  Add New Ponente
                </h2>
                <form onSubmit={handleSubmit(handleUser)} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    { label: 'Name', name: 'name' },
                    { label: 'Last Name', name: 'lastname' },
                    { label: 'Company', name: 'companny' },
                    { label: 'Category', name: 'categoria' },
                    { label: 'Stage', name: 'escenario' },
                    { label: 'Email', name: 'email', type: 'email', pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
                    { label: 'Event', name: 'event' }
                  ].map(({ label, name, type = 'text', pattern }) => (
                    <div key={name} className='w-full'>
                      <label className='block text-[#f1f7feb5]'>{label}</label>
                      <input
                        type={type}
                        name={name}
                        {...register(name, {
                          required: `${label} is required`,
                          pattern: pattern ? { value: pattern, message: `Invalid ${label.toLowerCase()} format` } : undefined,
                          onChange: (e) => handleChange(e)
                        })}
                        defaultValue={formData[name]}
                        className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c] text-white'
                      />
                      {errors[name] && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors[name].message}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className='col-span-1 md:col-span-2 flex justify-end gap-2 mt-4'>
                    <button
                      type='button'
                      onClick={handleClose}
                      className='px-4 py-2 hover:bg-[#d9edfe25] text-white rounded-lg'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 bg-[#ffffffe6] hover:bg-[#ffffff] opacity-60 hover:opacity-100 text-black rounded-lg'
                    >
                      Add
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
