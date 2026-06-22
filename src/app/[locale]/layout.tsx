import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Providers } from '../providers';
import ErrorBoundary from '../../components/ErrorBoundary';
import Header from '../../components/Header';

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const messages = await getMessages();
  const { locale } = await params;

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
