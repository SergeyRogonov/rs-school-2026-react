'use client';

import { Link, usePathname } from '../i18n/navigation';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = Object.fromEntries(searchParams.entries());

  return (
    <div className="flex overflow-hidden rounded-lg border border-(--border-color)">
      <Link
        href={{ pathname, query }}
        locale="en"
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-transparent text-(--text-secondary) hover:bg-white/10'
        }`}
      >
        EN
      </Link>

      <Link
        href={{ pathname, query }}
        locale="ru"
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          locale === 'ru'
            ? 'bg-blue-500 text-white'
            : 'bg-transparent text-(--text-secondary) hover:bg-white/10'
        }`}
      >
        RU
      </Link>
    </div>
  );
}
