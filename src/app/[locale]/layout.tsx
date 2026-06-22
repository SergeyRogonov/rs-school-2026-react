import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';

import { Providers } from '../providers';
import ErrorBoundary from '../../components/ErrorBoundary';
import Header from '../../components/Header';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <ErrorBoundary>
          <Header />
          {children}
        </ErrorBoundary>
      </Providers>
    </NextIntlClientProvider>
  );
}
