import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="flex w-full bg-[#d45d79] shadow-md">
      <nav className="flex items-center justify-between w-full px-4 py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              Pokémon Search App
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 text-white rounded-lg hover:bg-[#d68799] transition-colors duration-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 bg-white text-[#d45d79] rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            About
          </Link>
        </div>
      </nav>
    </div>
  );
}
