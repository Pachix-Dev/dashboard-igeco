'use client'

import { useToaster } from 'app/context/ToasterContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function AddNotes({ lead }) {
  const [notes, setNotes] = useState(lead.notes)
  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleUser = async () => {
    const response = await fetch(`/api/scanleads`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id_lead, notes }),
    })

    if (response.ok) {
      notify('Note update successfully', 'success')
    } else {
      notify('Failed to update note', 'error')
    }

    handleClose()
  }

  return (
    <>
      <div className='group relative flex justify-center'>
        <span className='absolute top-[-5px] right-12 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100'>
          ✨ Agrega una nota!
        </span>
        <button
          onClick={handleOpen}
          className='rounded text-sm text-white shadow-sm'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
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
        <div className='fixed inset-0 bg-gray-800 bg-opacity-85 flex justify-center items-center z-50'>
          <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold mb-4'>Add Note for User</h2>
            <form onSubmit={handleSubmit(handleUser)}>
              <div className='mb-4'>
                <p className='block text-[#f1f7feb5]'>About Lead</p>
                <p>
                  {lead.name} {lead.paternSurname} {lead.maternSurname} -{' '}
                  {lead.company}
                </p>
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Notes</label>
                <textarea
                  {...register('notes', {
                    required: 'Notes is required',
                    onChange: (e) => setNotes(e.target.value),
                  })}
                  defaultValue={lead.notes}
                  className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                />
                {errors.notes && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.notes.message}
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
