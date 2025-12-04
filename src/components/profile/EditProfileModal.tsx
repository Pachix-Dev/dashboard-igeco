'use client';

import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { updateProfile } from '@/lib/actions/profile';
import { useToaster } from '@/context/ToasterContext';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export default function EditProfileModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const { notify } = useToaster();
  const t = useTranslations('ProfilePage.modal');
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.photo || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: profile.name || '',
      company: profile.company || '',
      event: profile.event || '',
      stand: profile.stand || '',
      description: profile.description || '',
      description_en: profile.description_en || '',
      address: profile.address || '',
      webpage: profile.webpage || '',
      phone: profile.phone || '',
      facebook: profile.facebook || '',
      instagram: profile.instagram || '',
      linkedin: profile.linkedin || '',
      x: profile.x || '',
      youtube: profile.youtube || '',
      tiktok: profile.tiktok || '',
      photo: profile.photo || '',
    }
  });
  
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Upload
    setUploading(true);
    try {
      const id = uuidv4();
      const fd = new FormData();
      fd.append('image', file);
      fd.append('uuid', id);
      const res = await fetch('/api/upload/logo', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Error al subir');
      }
      const data = await res.json();
      // Solo guardar el nombre del archivo, no la ruta completa
      setValue('photo', data.path);
      setPreviewUrl(`/logos/${data.path}`);
      notify(t('toast.logoSuccess'), 'success');
    } catch (err: any) {
      notify(err?.message || t('toast.logoError'), 'error');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: any) {
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('company', values.company);
    fd.append('event', values.event);
    fd.append('stand', values.stand);
    fd.append('description', values.description);
    fd.append('description_en', values.description_en);
    fd.append('address', values.address);
    fd.append('webpage', values.webpage);
    fd.append('phone', values.phone);
    fd.append('facebook', values.facebook);
    fd.append('instagram', values.instagram);
    fd.append('linkedin', values.linkedin);
    fd.append('x', values.x);
    fd.append('youtube', values.youtube);
    fd.append('tiktok', values.tiktok);
    fd.append('photo', values.photo);

    startTransition(async () => {
      const result = await updateProfile(fd);
      if (result.success) {
        notify(t('toast.updateSuccess'), 'success');
        onClose();
      } else {
        notify(result.error || t('toast.updateError'), 'error');
      }
    });
  }

  return (
    <>
    {typeof document !== 'undefined' &&
        createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" width={128} height={128} className="w-full h-full object-contain" />
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        )}
                    </div>
                    </div>
                    <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={uploading || isPending}
                    className="hidden"
                    />
                    <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || isPending}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                    {uploading ? t('uploading') : t('changeLogo')}
                    </button>
                </div>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.name')} *</label>
                    <input
                        {...register('name', { required: t('form.nameRequired') })}
                        disabled={isPending}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{String(errors.name.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.company')} *</label>
                    <input
                        {...register('company', { required: t('form.companyRequired') })}
                        disabled={isPending}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.company && <p className="mt-1 text-xs text-red-400">{String(errors.company.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.event')} *</label>
                    <select
                        {...register('event', { required: t('form.eventRequired') })}
                        disabled={isPending}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">{t('form.eventSelect')}</option>
                        <option value="ECOMONDO">ECOMONDO</option>
                        <option value="RE+ MEXICO">RE+ MEXICO</option>
                    </select>
                    {errors.event && <p className="mt-1 text-xs text-red-400">{String(errors.event.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.stand')}</label>
                    <input
                        {...register('stand')}
                        disabled={isPending}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.address')}</label>
                    <input
                        {...register('address')}
                        disabled={isPending}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.webpage')}</label>
                    <input
                        {...register('webpage', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: t('form.webpageRequired')
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://ejemplo.com"
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.webpage && <p className="mt-1 text-xs text-red-400">{String(errors.webpage.message)}</p>}
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Teléfono</label>
                    <input
                        {...register('phone')}
                        disabled={isPending}
                        placeholder="+52 123 456 7890"
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    </div>

                    

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.description')}</label>
                        <textarea
                            {...register('description')}
                            disabled={isPending}
                            rows={4}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-1">{t('form.description_en')}</label>
                        <textarea
                            {...register('description_en')}
                            disabled={isPending}
                            rows={4}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Facebook</label>
                    <input
                        {...register('facebook', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: 'URL debe comenzar con http:// o https://'
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://facebook.com/..."
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.facebook && <p className="mt-1 text-xs text-red-400">{String(errors.facebook.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Instagram</label>
                    <input
                        {...register('instagram', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: 'URL debe comenzar con http:// o https://'
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://instagram.com/..."
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.instagram && <p className="mt-1 text-xs text-red-400">{String(errors.instagram.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">LinkedIn</label>
                    <input
                        {...register('linkedin', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: 'URL debe comenzar con http:// o https://'
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://linkedin.com/..."
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.linkedin && <p className="mt-1 text-xs text-red-400">{String(errors.linkedin.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">X (Twitter)</label>
                    <input
                        {...register('x', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: 'URL debe comenzar con http:// o https://'
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://x.com/..."
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.x && <p className="mt-1 text-xs text-red-400">{String(errors.x.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">YouTube</label>
                    <input
                        {...register('youtube', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: 'URL debe comenzar con http:// o https://'
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://youtube.com/..."
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.youtube && <p className="mt-1 text-xs text-red-400">{String(errors.youtube.message)}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">TikTok</label>
                    <input
                        {...register('tiktok', {
                          pattern: {
                            value: /^https?:\/\/.+/i,
                            message: 'URL debe comenzar con http:// o https://'
                          }
                        })}
                        disabled={isPending}
                        placeholder="https://tiktok.com/..."
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    {errors.tiktok && <p className="mt-1 text-xs text-red-400">{String(errors.tiktok.message)}</p>}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                    <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                    {t('cancel')}
                    </button>
                    <button
                    type="submit"
                    disabled={isPending || uploading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                    {isPending ? (
                        <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('saving')}
                        </>
                    ) : (
                        t('save')
                    )}
                    </button>
                </div>
                </form>
            </div>
        </div>
        , document.body)}
    </>
  );
}
