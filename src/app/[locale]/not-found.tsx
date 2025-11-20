'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('Common');

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-xl">Página no encontrada</p>
      <Link href="/" className="mt-8 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}
