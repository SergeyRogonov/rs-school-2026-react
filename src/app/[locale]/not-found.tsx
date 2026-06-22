'use client';

import { useTranslations } from 'next-intl';
import NotFound from '../../components/NotFound';

export default function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <NotFound
      title={t('title')}
      description={t('description')}
      buttonText={t('button')}
    />
  );
}
