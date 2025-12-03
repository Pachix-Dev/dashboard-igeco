import { getProfile } from '@/lib/actions/profile';
import EditProfileButton from './EditProfileButton';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function ProfileInfo() {
  const profile = await getProfile();

  const t = await getTranslations('ProfilePage');

  const statusConfig = profile.status === 1
    ? { label: t('status.active'), color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' }
    : { label: t('status.disabled'), color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' };
  
  // Check if profile is incomplete
  const isIncomplete = !profile.name || !profile.company || !profile.stand || !profile.address || !profile.description || !profile.photo || !profile.webpage || !profile.event || !profile.description_en;
  
    if (profile.success === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
                <p className="text-red-500 text-lg">{profile.error || t('errors.loadProfile')}</p>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-slate-400">{t('subtitle')}</p>
        </div>

        {/* Alert for incomplete profile */}
        {isIncomplete && (
          <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-400 mb-1">{t('alert.title')}</h3>
                <p className="text-slate-300">{t('alert.description')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl shadow-blue-500/5 backdrop-blur">
          {/* Cover gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
          </div>

          <div className="px-6 pb-8">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 relative">
              <div className="flex gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-1 shadow-2xl shadow-blue-500/30">
                    <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                      {profile.photo ? (
                        <Image src={profile.photo} alt="Logo" width={128} height={128} className="w-full h-full object-contain" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className={`absolute bottom-2 right-2 w-5 h-5 ${profile.status === 1 ? 'bg-emerald-500' : 'bg-red-500'} rounded-full border-4 border-slate-900`}></div>
                </div>

                <div className="flex-1 space-y-3 sm:mb-4">
                  <div>
                    <p className="text-slate-300 text-sm mt-1">Stand {profile.stand}</p>
                    <h2 className="text-2xl font-bold text-white">{profile.company}</h2>
                    
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                    <div className={`w-2 h-2 rounded-full ${profile.status === 1 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                    <span className={`text-sm font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                  </div>
                </div>
              </div>
                            
              {/* Edit button */}
              <div className="sm:mb-4">
                <EditProfileButton profile={profile} />
              </div>
            </div>

            {/* Info grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">                    
                    <p className="text-base font-semibold text-white truncate">{profile.name || 'N/A'}</p>
                    <p className="text-sm font-medium text-slate-400 mb-1">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* Event */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('fields.event')}</p>
                    <p className="text-base font-semibold text-white truncate">{profile.event || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Stand */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('fields.stand')}</p>
                    <p className="text-base font-semibold text-white truncate">{profile.stand || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('fields.address')}</p>
                    <p className="text-base font-semibold text-white truncate">{profile.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Webpage */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('fields.webpage')}</p>
                    {profile.webpage ? (
                      <a href={profile.webpage} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-indigo-400 hover:text-indigo-300 truncate block">
                        {profile.webpage}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-white truncate">N/A</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">Teléfono</p>
                    <p className="text-base font-semibold text-white truncate">{profile.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
                                        
              {/* Description - full width */}
              <div className=" p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('fields.description')}</p>
                    <p className="text-base text-white line-clamp-3">{profile.description || t('fields.noDescription')}</p>
                  </div>
                </div>
              </div>

              {/* Description - full width */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">{t('fields.description_en')}</p>
                    <p className="text-base text-white line-clamp-3">{profile.description_en || t('fields.noDescription')}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
                <p className="text-sm font-medium text-slate-400 mb-3">Redes Sociales</p>
                <div className="flex flex-wrap gap-3">
                {profile.facebook && (
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                    </a>
                )}
                {profile.instagram && (
                    <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600/10 border border-pink-500/20 text-pink-400 hover:bg-pink-600/20 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                    </a>
                )}
                {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700/10 border border-blue-600/20 text-blue-400 hover:bg-blue-700/20 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                    </a>
                )}
                {profile.x && (
                    <a href={profile.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600/10 border border-slate-500/20 text-slate-300 hover:bg-slate-600/20 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X
                    </a>
                )}
                {profile.youtube && (
                    <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    YouTube
                    </a>
                )}
                {profile.tiktok && (
                    <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/10 border border-slate-700/20 text-slate-300 hover:bg-slate-800/20 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                    TikTok
                    </a>
                )}
                </div>
            </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"></path></svg>
                </div>
                <div className="flex-1"><p className="text-sm font-medium text-blue-200 mb-1">{t('banner.title')}</p><p className="text-sm text-blue-300/80">{t('banner.message')}</p>
                </div>
            </div>
        </div>
      </div>        
    </div>
  );
}
