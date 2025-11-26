import type {Metadata} from 'next';
import './globals.css';
import {defaultLocale} from 'app/i18n/routing';

export const metadata: Metadata = {
  title: 'IGECO | Dashboard',
  description: 'app expositores, scanners',
  icons: {
    icon: '/img/deutschemesselogo.webp',
    shortcut: '/img/deutschemesselogo.webp',
    apple: '/img/deutschemesselogo.webp',
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
