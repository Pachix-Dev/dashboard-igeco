import { useState } from 'react'
import QRCode from 'react-qr-code'

export function QrPrinter({ exhibitor }) {
  const [showQr, setShowQr] = useState(false)

  const generarqr = () => {
    setShowQr(!showQr)
  }

  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-6 cursor-pointer hover:scale-125 ease-in-out duration-500'
        onClick={() => {
          generarqr()
        }}
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

      {showQr && (
        <div className='absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center mx-auto '>
          <div className='text-black text-center'>
            <QRCode value={exhibitor?.uuid} />
            <p className='mt-5 font-bold text-2xl'>
              {exhibitor?.name} {exhibitor?.lastname}
            </p>
            <p className=' text-xl'>{exhibitor.position}</p>
            <p className=' text-xl'>{exhibitor.company}</p>
          </div>
        </div>
      )}
    </>
  )
}
