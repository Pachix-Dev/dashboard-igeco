'use client'

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react'

// Define la estructura de una notificación
interface Notification {
  message: string
  type: 'success' | 'error'
}

// Define el contexto para el Toaster
interface ToasterContextType {
  notify: (message: string, type: 'success' | 'error') => void
}

// Crea el contexto
const ToasterContext = createContext<ToasterContextType | undefined>(undefined)

// Proveedor del contexto
export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null)

  // Función para mostrar la notificación
  const notify = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000) // Oculta la notificación después de 3 segundos
  }, [])

  return (
    <ToasterContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <ol
        tabIndex={-1}
        className="absolute bottom-0 right-0 z-50 p-6"
        >
        <li>
          <div
            className={`${
                notification.type === 'success'
                ? 'bg-gradient-to-r from-[#44ffaa4b] from-10% to-transparent to-40% border-[#44ffaa4b]'
                : 'bg-gradient-to-r from-red-600 from-10% to-transparent to-40% border-red-600'
            } relative flex w-full flex-col gap-2 overflow-hidden rounded-md p-4 border`}
          >
            <div className="flex items-center gap-4">
              
              <div
                className={`absolute -left-20 -top-4 z-10 h-[200px] w-[160px] rounded-full blur-lg ${
                    notification.type === 'success' ? 'bg-[#44ffaa4b]' : 'bg-red-600'
                }`}
              ></div>

              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 relative z-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15L15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>

            
              <div className="relative z-20">
                <h1 className="text-sm text-slate-12 font-semibold">{notification.message}</h1>
              </div>
            </div>
          </div>
        </li>
      </ol>
       
      )}
    </ToasterContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useToaster = () => {
  const context = useContext(ToasterContext)
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider')
  }
  return context
}
