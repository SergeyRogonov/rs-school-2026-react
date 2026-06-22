import { setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import About from '../../../components/About';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <About />;
}
