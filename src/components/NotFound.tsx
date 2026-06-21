import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-(--bg-secondary) rounded-lg shadow-(--card-shadow) p-6 mb-6 text-center">
        <h2 className="text-3xl font-bold text-(--brand-header) mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-lg mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-(--brand-header) text-(--bg-secondary) rounded-lg hover:bg-(--border-color) font-medium inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
