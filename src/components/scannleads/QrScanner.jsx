'use client'

import { Scanner } from '@yudiel/react-qr-scanner'
import { useState } from 'react'
import { useSessionUser } from 'app/store/session-user'
import { useToaster } from 'app/context/ToasterContext'

export function QrScanner() {
  const [showScanner, setShowScanner] = useState(false)
  const { notify } = useToaster()
  const { userSession } = useSessionUser()

  const handleScan = async (result) => {
    const response = await fetch('/api/scanleads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: result[0].rawValue,
        user_id: userSession.id,
      }),
    })
    const data = await response.json()
    if (response.ok) {
      notify(data.message, 'success')
      setShowScanner(!showScanner)
    } else {
      notify(data.message, 'error')
      setShowScanner(!showScanner)
    }
  }

  const toggleScanner = () => {
    setShowScanner(!showScanner)
  }

  return (
    <>
      <button
        onClick={toggleScanner}
        className='flex gap-2 border rounded-md p-1 bg-gray-900'
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
            d='M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z'
          />
        </svg>
        {showScanner ? 'Hide Scanner' : 'Scan QR'}
      </button>
      {showScanner && (
        <div className='fixed top-8 rounded-t-lg inset-0 bg-white grid justify-center items-center z-10'>
          <div className='text-black grid h-full items-end'>
            <div className='flex gap-2 items-center justify-evenly'>
              <button
                onClick={toggleScanner}
                className='p-2 bg-slate-800 hover:bg-slate-600 rounded-lg text-white'
              >
                Cancelar
              </button>
              <p className='font-extrabold text-xl'>Escanea el código QR</p>
            </div>
            <p className='font-semibold text-gray-500 text-center text-lg'>
              Escanea el gafete del visitante
            </p>
          </div>
          <div>
            <Scanner
              onScan={(result) => handleScan(result)}
              allowMultiple
              paused={false}
              scanDelay={2000}
            />
          </div>
        </div>
      )}
    </>
  )
}
