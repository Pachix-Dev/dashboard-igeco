'use client'

import { Scanner } from '@yudiel/react-qr-scanner'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useSessionUser } from 'app/store/session-user'
import { useToaster } from 'app/context/ToasterContext'

export function QrScanner() {
  const t = useTranslations('ScanLeadsPage')
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
        token: userSession.token,
      }),
    })
    if (response.status === 401) {
      window.location.href = '/session-limit'
    }
    const data = await response.json()
    if (response.ok) {
      notify(data.message, 'success')
      setShowScanner(false)
      window.location.reload()
    } else {
      notify(data.message, 'error')
      setShowScanner(false)
    }
  }

  const toggleScanner = () => {
    setShowScanner(!showScanner)
  }

  return (
    <>
      <button
        onClick={toggleScanner}
        className='group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:ring-offset-2 focus:ring-offset-slate-950'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
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
        <span>{showScanner ? t('scanner.hide') : t('scanner.show')}</span>
      </button>

      {showScanner && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-3 py-4 backdrop-blur-sm'>
          <div className='flex h-full w-full max-w-5xl flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-4 py-4 shadow-2xl shadow-emerald-500/20 sm:h-auto sm:max-h-[90vh] sm:px-6 sm:py-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h3 className='text-xl font-bold text-white'>{t('scanner.title')}</h3>
                <p className='text-sm text-slate-400'>{t('scanner.desc')}</p>
              </div>
              <button
                onClick={toggleScanner}
                className='self-end rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
              >
                {t('actions.close')}
              </button>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-200 shadow-inner shadow-emerald-500/5'>
              <p>{t('scanner.notice.primary')}</p>
              <p className='text-slate-400'>{t('scanner.notice.secondary')}</p>
            </div>

            <div className='flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 shadow-inner shadow-emerald-500/10 sm:flex-row'>
              <div className='w-full max-w-md'>
                <Scanner
                  onScan={(result) => handleScan(result)}
                  allowMultiple
                  paused={false}
                  scanDelay={2000}
                  className='h-full w-full'
                />
              </div>
              <p className='text-center text-xs text-slate-400 sm:max-w-xs sm:text-left'>
                {t('scanner.helper')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
