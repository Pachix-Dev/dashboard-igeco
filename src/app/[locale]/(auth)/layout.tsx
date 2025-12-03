import LanguageSelector from '@/components/shared/LanguageSelector';
import Image from 'next/image';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="absolute right-4 top-4">
        <LanguageSelector />
      </div>

      <section className="mx-auto w-full max-w-md px-4">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="rounded-xl w-12 h-12 bg-white p-2 shadow-lg">
            <Image
              src="/img/italian.png"
              alt="Italian Logo"
              width={40}
              height={40}              
            />
          </div>
          <div className="rounded-xl w-12 h-12 bg-white p-2 shadow-lg">
            <Image
              src="/img/deutschemesselogo.webp"
              alt="Deutsche Messe Logo"
              width={40}
              height={40}            
            />
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}
