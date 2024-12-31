'use client'

import Image from 'next/image'
import QrCodeWithLogo from 'qrcode-with-logos'
import { useEffect, useRef } from 'react'

export default function GenerarQr() {
  const imgRef = useRef(null) // Reference for the image element

  useEffect(() => {
    if (imgRef.current) {
      const qrcode = new QrCodeWithLogo({
        content: 'be463301-5da7-4492-8b6a-2b2ddd16f507',
        width: 1920,
        image: imgRef.current, // Referencing the img element
        logo: {
          src: '/V3.png',
        },
      })

      qrcode.downloadImage('qrcode.png') // Download the QR code image
    }
  }, [])

  return (
    <main className='min-h-screen p-4 w-full '>
      <h1>Generar QR con logo personalizado</h1>
      <Image id='image' ref={imgRef} alt='QR Code' />
    </main>
  )
}
