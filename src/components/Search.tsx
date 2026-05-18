import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [lastSearchTerm, setLastSearchTerm] = useLocalStorage('lastSearchTerm');
  const [query, setQuery] = useState(lastSearchTerm);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    setQuery(trimmedQuery);
    setLastSearchTerm(trimmedQuery);
    onSearch(trimmedQuery);
  };

  return (
    <div>
      <form
        className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4 w-full px-4 sm:px-6"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded max-w-xl"
          placeholder="Search by name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <button
          className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
}
