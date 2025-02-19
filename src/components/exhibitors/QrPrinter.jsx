import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'

export function QrPrinter({ exhibitor }) {
  const [showQr, setShowQr] = useState(false)

  const generarqr = () => {
    setShowQr(!showQr)
  }
  const modalRef = useRef();
  //para que se muestre un modal
  const Modal=()=>{
    setShowQr(!showQr)
  }
  //para imprimir 

  
  const imprimir = () => {
    if (modalRef.current) {
      // Guarda el contenido original
      const originalContents = document.body.innerHTML; 
      
      const printContents = modalRef.current.innerHTML; // Obtiene solo el contenido del modal
  
      document.body.innerHTML = printContents; // Reemplaza el contenido con el modal
        window.print();
        //estaura el ontenido original 
        document.body.innerHTML = originalContents; 
        window.location.reload(); 
      
    }
  };
  
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
            <div ref={modalRef}>
            <QRCode value={exhibitor?.uuid} />
            <p className='mt-5 font-bold text-2xl'>
              {exhibitor?.name} {exhibitor?.lastname}
            </p>
            <p className=' text-xl'>{exhibitor.position}</p>
            <p className=' text-xl'>{exhibitor.company}</p></div>
            <div className='mt-4 flex justify-center gap-4'>
              <button onClick={imprimir} className='bg-blue-500 text-white px-4 py-2 rounded'>Imprimir</button>
              <button onClick={Modal} className='bg-red-500 text-white px-4 py-2 rounded'>Cerrar</button>
            </div>
          </div>
          
        </div>
      )}
      <style>
      

      </style>
    </>
  )
}
