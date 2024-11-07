'use client'

import { useState } from 'react'

export function AddUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('User Added:', { name, email })
    handleClose()
  }
  return (
    <>
      <button
        className='bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white'
        onClick={handleOpen}
      >
        + Agregar Usuario
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-[#05050a] p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold mb-4'>Add New User</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-[#f1f7feb5]'>Email</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
                  required
                />
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
