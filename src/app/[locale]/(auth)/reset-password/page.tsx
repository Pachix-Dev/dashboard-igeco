'use client';

import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {useState, Suspense} from 'react';
import Link from 'next/link';

function ResetPasswordForm() {
  const t = useTranslations('ResetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!token) {
      setError(t('errors.invalidToken'));
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('errors.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          token,
          password: formData.password
        })
      });

      const data = await res.json();

      if (data.status) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-lg border border-red-500 border-opacity-50 bg-red-500 bg-opacity-20 p-4">
        <p className="text-center text-sm font-medium text-red-300">
          {t('errors.invalidToken')}
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-center text-3xl font-bold text-white">{t('title')}</h1>
      <p className="mb-8 text-center text-sm text-gray-300">{t('subtitle')}</p>

      {success ? (
        <div className="rounded-lg border border-green-500 border-opacity-50 bg-green-500 bg-opacity-20 p-4">
          <p className="text-center text-sm font-medium text-green-300">
            {t('success')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              {t('newPassword')}
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
        <Link href="/login" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
          {t('backToLogin')}
        </Link>
      </div>
    </>
  );
}

export default function ResetPassword() {
  const t = useTranslations('ResetPassword');
  
  return (
    <>
      <div className="rounded-2xl border border-white border-opacity-20 bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-md">
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        {t('footer')}
      </p>
    </>
  );
}
