import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/useTheme';

export default function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear localStorage
    localStorage.removeItem('lastSearchTerm');
    // Navigate to home with fresh state
    navigate('/?page=1', { replace: true });
  };
  return (
    <div className="flex w-full bg-(--brand-header) shadow-md">
      <nav className="flex items-center justify-between w-full px-4 py-3">
        <div className="flex items-center">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2"
          >
            <h1 className="text-2xl font-bold text-(--text-secondary) transition-colors duration-200">
              Pokémon Search App
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="px-4 py-2 bg-(--bg-secondary) text-(--brand-header) rounded-lg hover:opacity-80 transition-colors duration-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 bg-(--bg-secondary) text-(--brand-header) rounded-lg hover:opacity-80 font-medium transition-colors duration-200"
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
  );
}
