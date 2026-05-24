import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-lg mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
