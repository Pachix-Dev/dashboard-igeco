import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
// import {setRequestLocale} from 'next-intl/server';
import type {ReactNode} from 'react';
import {ToasterProvider} from 'app/context/ToasterContext';
import {locales} from 'app/i18n/routing';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Enable static rendering
  // setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ToasterProvider>{children}</ToasterProvider>
    </NextIntlClientProvider>
  );
}
