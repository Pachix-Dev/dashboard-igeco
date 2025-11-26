import {NextIntlClientProvider} from 'next-intl';
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';
import {ToasterProvider} from 'app/context/ToasterContext';
import {locales} from 'app/i18n/routing';

// Forzar renderizado dinámico (app requiere autenticación con middleware)
export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  const {locale} = params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ToasterProvider>{children}</ToasterProvider>
    </NextIntlClientProvider>
  );
}
