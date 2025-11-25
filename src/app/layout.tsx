import type {Metadata} from 'next';
import {getLocale} from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'IGECO | Dashboard',
  description: 'app expositores, scanners',
  icons: {
    icon: '/img/deutschemesselogo.webp',
    shortcut: '/img/deutschemesselogo.webp',
    apple: '/img/deutschemesselogo.webp',
  },
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
