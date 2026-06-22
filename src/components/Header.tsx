'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../context/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [, setStoredValue] = useLocalStorage('lastSearchTerm');

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setStoredValue('');
    router.replace('/?page=1');
  };
  return (
    <div className="sticky top-0 z-20">
      <div className="flex w-full bg-(--brand-header) shadow-md">
        <nav className="flex items-center justify-between w-full px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="flex items-center gap-2"
            >
              <h1 className="text-2xl font-bold text-(--text-secondary)">
                Pokémon Search App
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="px-4 py-2 bg-(--bg-secondary) text-(--brand-header) rounded-lg hover:bg-(--bg-secondary-hover) font-medium"
            >
              {t('header.home')}
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 bg-(--bg-secondary) text-(--brand-header) rounded-lg hover:bg-(--bg-secondary-hover) font-medium "
            >
              {t('header.about')}
            </Link>
            <LocaleSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2 rounded text-(--text-secondary)"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
