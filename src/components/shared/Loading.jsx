'use client'

export function Loading({ message = 'Cargando...', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className='flex items-center justify-center gap-3'>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-blue-500 border-t-transparent`}
      ></div>
      {message && (
        <p className={`${textSizes[size]} text-slate-400`}>{message}</p>
      )}
    </div>
  )
}

export function LoadingOverlay({
  message = 'Procesando...',
  fullScreen = false,
}) {
  return (
    <div
      className={`${
        fullScreen ? 'fixed' : 'absolute'
      } inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm`}
    >
      <div className='rounded-2xl border border-white/10 bg-slate-900/90 px-8 py-6 shadow-2xl'>
        <Loading message={message} size='md' />
      </div>
    </div>
  )
}
