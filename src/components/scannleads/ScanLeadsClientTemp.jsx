'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

const CheckIcon = () => (
    <svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
        <path d='M20 6 9 17l-5-5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
)

const DownloadIcon = () => (
    <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M7 10l5 5 5-5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 15V3' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
)

const ManualIcon = () => (
    <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
        <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
)

const APP_DOWNLOAD_URL = '/files/Passale_Descarga_App_Guia_2026.pdf'
const MANUAL_URL = '/files/Passale_Expositores_Manual_Tecnico_2026.pdf'

export function ScanLeadsClientTemp() {

    const t = useTranslations('ScanLeadsClientTemp');

    return (
        <div className='mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-slate-950/70 shadow-2xl shadow-emerald-500/10 backdrop-blur'>
            <div className='border-b border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-white/5 px-6 py-10 text-center sm:px-10'>
                <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-emerald-300 shadow-lg shadow-emerald-500/20'>
                    <CheckIcon />
                </div>
                <p className='mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-300'>{t('badge')}</p>
                <h1 className='mt-3 text-3xl font-bold text-white sm:text-4xl'>{t('title')}</h1>
                <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg'>{t('description')}</p>
            </div>

            <div className='grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]'>
                <div className='space-y-5'>
                    <h2 className='text-xl font-semibold text-white'>{t('nextSteps.title')}</h2>
                    <div className='space-y-3'>
                        <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                            <p className='text-sm font-semibold text-slate-100'>{t('nextSteps.access.title')}</p>
                            <p className='mt-1 text-sm leading-6 text-slate-400'>{t('nextSteps.access.description')}</p>
                        </div>
                        <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                            <p className='text-sm font-semibold text-slate-100'>{t('nextSteps.scan.title')}</p>
                            <p className='mt-1 text-sm leading-6 text-slate-400'>{t('nextSteps.scan.description')}</p>
                        </div>
                        <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                            <p className='text-sm font-semibold text-slate-100'>{t('nextSteps.export.title')}</p>
                            <p className='mt-1 text-sm leading-6 text-slate-400'>{t('nextSteps.export.description')}</p>
                        </div>
                    </div>
                </div>

                <aside className='rounded-2xl border border-white/10 bg-white/[0.04] p-5'>
                    <p className='text-sm font-semibold text-emerald-300'>{t('status.label')}</p>
                    <p className='mt-2 text-2xl font-bold text-white uppercase'>{t('status.title')}</p>
                    <p className='mt-3 text-sm leading-6 text-slate-400'>{t('status.description')}</p>
                    <div className='mt-6 space-y-3'>
                        <a
                            href={APP_DOWNLOAD_URL}
                            target='_blank'
                            className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300'
                        >
                            <DownloadIcon />
                            {t('actions.downloadApp')}
                        </a>
                        <a
                            href={MANUAL_URL}
                            target='_blank'
                            rel='noreferrer'
                            className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10'
                        >
                            <ManualIcon />
                            {t('actions.readManual')}
                        </a>
                    </div>
                    <p className='mt-4 text-xs leading-5 text-blue-500 text-justify'>{t('support')}</p>
                </aside>
            </div>
        </div>
    )
}
