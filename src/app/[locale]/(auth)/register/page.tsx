'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/routing';
import {useState} from 'react';
import Link from 'next/link';

export default function Register() {
  const t = useTranslations('Register');
  const locale = useLocale();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
    event: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t('errors.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          password: formData.password,
          event: formData.event,
          locale: locale
        })
      });

      const data = await res.json();

      if (data.status) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login', {locale: locale as 'es' | 'en' | 'it'});
        }, 4000);
      } else {
        setError(data.message || t('errors.serverError'));
      }
    } catch (error) {
      setError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      <div className="rounded-2xl border border-white border-opacity-20 bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">{t('title')}</h1>
        <p className="mb-8 text-center text-sm text-gray-300">{t('subtitle')}</p>

        {success ? (
          <div className="space-y-4 rounded-lg border border-green-500 border-opacity-50 bg-green-500 bg-opacity-20 p-6">
            <div className="flex justify-center">
              <svg className="h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-center text-base font-semibold text-green-300">
              ¡Registro exitoso!
            </p>
            <p className="text-center text-sm text-green-200">
              Hemos enviado tus credenciales de acceso a <strong>{formData.email}</strong>
            </p>
            <p className="text-center text-xs text-green-300">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                {t('name')}
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                  placeholder={t('namePlaceholder')}
                />
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                {t('company')}
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                  placeholder={t('companyPlaceholder')}
                />
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                {t('event')}
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <select
                  value={formData.event}
                  onChange={(e) => setFormData({...formData, event: e.target.value})}
                  required
                  className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-10 text-white transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none appearance-none"
                >
                  <option value="" className="bg-gray-800">{t('selectEvent')}</option>
                  <option value="ECOMONDO" className="bg-gray-800">ECOMONDO</option>
                  <option value="RE+ MEXICO" className="bg-gray-800">RE+ MEXICO</option>
                </select>
                <svg
                  className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                {t('email')}
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                {t('password')}
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                  placeholder={t('passwordPlaceholder')}
                />
              </div>
              
              {/* Requisitos de contraseña */}
              <div className="mt-3 rounded-lg border border-blue-500 border-opacity-30 bg-blue-500 bg-opacity-10 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('passwordRequirements.title')}
                </p>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-green-400' : ''}`}>
                    <span className={`text-lg ${formData.password.length >= 6 ? '✓' : '•'}`}></span>
                    {t('passwordRequirements.minLength')}
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <span className={`text-lg ${/[A-Z]/.test(formData.password) ? '✓' : '•'}`}></span>
                    {t('passwordRequirements.uppercase')}
                  </li>
                  <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <span className={`text-lg ${/[a-z]/.test(formData.password) ? '✓' : '•'}`}></span>
                    {t('passwordRequirements.lowercase')}
                  </li>
                  <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <span className={`text-lg ${/[0-9]/.test(formData.password) ? '✓' : '•'}`}></span>
                    {t('passwordRequirements.number')}
                  </li>
                  <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <span className={`text-lg ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? '✓' : '•'}`}></span>
                    {t('passwordRequirements.special')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-opacity-20 focus:outline-none"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
              </div>
            </div>

            

            {error && (
              <div className="rounded-lg border border-red-500 border-opacity-50 bg-red-500 bg-opacity-20 p-3">
                <p className="text-sm font-medium text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>{t('submit')}</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            {t('hasAccount')}{' '}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              {t('loginLink')}
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        {t('footer')}
      </p>
    </>
  );
}
