'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getUserSessions, closeSession, registerSession } from '@/lib/actions/sessions';
import { useToaster } from '@/context/ToasterContext';
import { createPortal } from 'react-dom';

interface ActiveSession {
  id: number;
  device_info?: string;
  ip_address?: string;
  last_activity: string;
  created_at: string;
  is_current?: boolean;
}

interface SessionManagerProps {
  onSessionsUpdate?: () => void;
}

export function SessionManager({ onSessionsUpdate }: SessionManagerProps) {
  const t = useTranslations('SessionManager');
  const { notify } = useToaster();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [maxSessions, setMaxSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sessionToClose, setSessionToClose] = useState<number | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getUserSessions();
      if (data) {
        setSessions(data.sessions);
        setMaxSessions(data.maxSessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // Registrar sesión actual
    const deviceInfo = `${navigator.platform} - ${navigator.userAgent.slice(0, 50)}`;
    registerSession(deviceInfo);
  }, []);

  const handleCloseSession = async (sessionId: number) => {
    setSessionToClose(sessionId);
    setShowModal(true);
  };

  const confirmCloseSession = async () => {
    if (!sessionToClose) return;

    try {
      const result = await closeSession(sessionToClose);
      if (result.success) {
        notify(t('sessionClosed'), 'success');
        await loadSessions();
        onSessionsUpdate?.();
      } else {
        notify(result.error || t('error'), 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      notify(t('error'), 'error');
    } finally {
      setShowModal(false);
      setSessionToClose(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDeviceName = (deviceInfo?: string) => {
    if (!deviceInfo) return t('unknownDevice');
    if (deviceInfo.includes('Win')) return '💻 Windows';
    if (deviceInfo.includes('Mac')) return '🍎 macOS';
    if (deviceInfo.includes('Linux')) return '🐧 Linux';
    if (deviceInfo.includes('Android')) return '📱 Android';
    if (deviceInfo.includes('iPhone') || deviceInfo.includes('iPad')) return '📱 iOS';
    return '🖥️ ' + deviceInfo.slice(0, 30);
  };

  if (loading) {
    return (
      <div className='rounded-2xl border border-white/10 bg-slate-950/50 p-6'>
        <div className='flex items-center gap-3'>
          <div className='h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-blue-500' />
          <p className='text-sm text-slate-400'>{t('loading')}</p>
        </div>
      </div>
    );
  }

  const activeSessions = sessions.length;
  const hasAvailableSlots = activeSessions < maxSessions || maxSessions === 0;

  return (
    <>
      <div className='rounded-2xl border border-white/10 bg-slate-950/50 p-6 space-y-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-bold text-white'>{t('title')}</h3>
            <p className='text-sm text-slate-400'>{t('subtitle')}</p>
          </div>
          <div className='rounded-xl border border-white/10 bg-white/5 px-4 py-2'>
            <p className='text-xs font-semibold uppercase tracking-wide text-slate-400'>
              {t('sessionsUsed')}
            </p>
            <p className='text-2xl font-bold text-white'>
              {activeSessions} <span className='text-lg text-slate-400'>/ {maxSessions}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className='relative h-3 overflow-hidden rounded-full bg-white/5'>
          <div
            className={`h-full transition-all duration-500 ${
              activeSessions >= maxSessions
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400'
            }`}
            style={{ width: `${maxSessions > 0 ? (activeSessions / maxSessions) * 100 : 0}%` }}
          />
        </div>

        {/* Alert si está al límite */}
        {activeSessions >= maxSessions && maxSessions > 0 && (
          <div className='rounded-xl border border-red-500/30 bg-red-500/10 p-4'>
            <div className='flex items-start gap-3'>
              <svg className='h-5 w-5 flex-shrink-0 text-red-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
              <div>
                <p className='font-semibold text-red-200'>{t('limitReached')}</p>
                <p className='mt-1 text-sm text-red-300'>{t('limitReachedDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de sesiones */}
        <div className='space-y-2'>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-xl border p-4 transition ${
                session.is_current
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-white'>
                      {getDeviceName(session.device_info)}
                    </p>
                    {session.is_current && (
                      <span className='rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-200'>
                        {t('current')}
                      </span>
                    )}
                  </div>
                  <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400'>
                    {session.ip_address && (
                      <span className='flex items-center gap-1'>
                        <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        {session.ip_address}
                      </span>
                    )}
                    <span className='flex items-center gap-1'>
                      <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      {t('lastActivity')}: {formatDate(session.last_activity)}
                    </span>
                    <span className='flex items-center gap-1'>
                      <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      {t('created')}: {formatDate(session.created_at)}
                    </span>
                  </div>
                </div>
                {!session.is_current && (
                  <button
                    onClick={() => handleCloseSession(session.id)}
                    className='rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20'
                  >
                    {t('closeSession')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className='rounded-xl border border-dashed border-white/20 p-8 text-center'>
            <p className='text-slate-400'>{t('noSessions')}</p>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl'>
            <div className='mb-4 flex items-start gap-3'>
              <div className='rounded-full bg-red-500/20 p-3'>
                <svg className='h-6 w-6 text-red-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                </svg>
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-white'>{t('confirmCloseTitle')}</h3>
                <p className='mt-1 text-sm text-slate-400'>{t('confirmCloseDesc')}</p>
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowModal(false)}
                className='flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10'
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmCloseSession}
                className='flex-1 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]'
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
