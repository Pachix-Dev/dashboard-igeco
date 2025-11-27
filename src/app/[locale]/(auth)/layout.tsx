'use client';

import {Img} from '@react-email/components';
import LanguageSelector from '@/components/shared/LanguageSelector';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="absolute right-4 top-4">
        <LanguageSelector />
      </div>

      <section className="mx-auto w-full max-w-md px-4">
        <div className="mb-8 flex justify-center gap-4">
          <div className="rounded-2xl bg-white p-2 shadow-lg">
            <Img
              src="/img/italian.png"
              alt="Italian Logo"
              className="h-20 w-20 rounded-xl object-contain"
            />
          </div>
          <div className="rounded-2xl bg-white p-2 shadow-lg">
            <Img
              src="/img/deutschemesselogo.webp"
              alt="Deutsche Messe Logo"
              className="h-20 w-20 rounded-xl object-contain"
            />
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}
