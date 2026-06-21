'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Header() {
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
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 bg-(--bg-secondary) text-(--brand-header) rounded-lg hover:bg-(--bg-secondary-hover) font-medium "
            >
              About
            </Link>
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
