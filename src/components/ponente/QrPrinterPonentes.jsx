import { useSessionUser } from 'app/store/session-user'
import { useState } from 'react'
import QRCode from 'react-qr-code'

export function QrPrinterPonente({ ponente }) {
  const [showQr, setShowQr] = useState(false)
  const { userSession } = useSessionUser()
  const Modal = () => {
    setShowQr(!showQr)
  }

  const handlePrint = async () => {
    const updatePrintUser = await fetch('/api/ponentes/printer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: ponente.id }),
    })

    if (!updatePrintUser.ok) {
      alert('Error al actualizar el usuario')
      return
    }

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { text-align: center; padding: 20px; }
            svg { max-width: 100%; height: auto; }
            p {font-weight: bold;}
          </style>
        </head>
        <body>
          
          <div>
            ${document.getElementById('qr-code').outerHTML}
          </div>
          <h1>${ponente.speaker_name}</h1>           
          <p>SPEAKER<br />${ponente.company}</p>           
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <>
      {userSession?.role === 'admin' && (
        <>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6 cursor-pointer hover:scale-125 ease-in-out duration-500'
            onClick={() => {
              Modal()
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
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white p-7 rounded-lg shadow-lg text-center text-black'>
                <div id='qr-code' className='flex justify-center'>
                  <QRCode value={ponente?.uuid} size={110} />
                </div>

                <p className='mt-5 font-bold text-2xl'>
                  {ponente?.speaker_name}
                </p>
                <p>SPEAKER</p>
                <p className=' text-xl'>{ponente.company}</p>

                <div className='mt-4 flex justify-center gap-4'>
                  <button
                    onClick={handlePrint}
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                  >
                    Imprimir
                  </button>
                  <button
                    onClick={Modal}
                    className='bg-red-500 text-white px-4 py-2 rounded'
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
