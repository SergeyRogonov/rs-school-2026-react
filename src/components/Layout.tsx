import { useEffect, useState, useCallback } from 'react';
import Header from './Header';
import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import type { Pokemon } from '../types/types.ts';
import TestErrorButton from './TestErrorButton.tsx';
import { fetchPokemon } from '../services/pokemonService';

export default function Layout() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPokemon = useCallback(
    async (query?: string) => {
      const queryToUse = query || '';

      if (queryToUse === lastQuery) {
        return;
      }

      setLoading(true);
      setLastQuery(queryToUse);

      try {
        const data = await fetchPokemon(query);
        if (Array.isArray(data)) {
          setPokemon(data);
        } else if (data) {
          setPokemon([data]);
        } else {
          setPokemon([]);
          throw new Error(`Pokémon "${query}" not found`);
        }

        setLoading(false);
        setError(null);
      } catch (err) {
        setPokemon([]);
        setLoading(false);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
    [lastQuery]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const lastSearch = localStorage.getItem('lastSearchTerm');
      if (lastSearch) {
        loadPokemon(lastSearch);
      } else {
        loadPokemon();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loadPokemon]);

  const handleSearch = (query: string) => {
    loadPokemon(query);
  };

  return (
    <div className="flex flex-col min-h-screen p-5">
      <div className="sticky top-0 flex flex-col gap-5 bg-[#d6fff2] z-20 p-10">
        <Header />
        <Search onSearch={handleSearch} />
      </div>
      <div className="flex overflow-auto justify-center">
        {error && (
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {loading && !error && <Spinner />}
        {!loading && !error && <CardList pokemon={pokemon} />}
      </div>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-20 z-10">
        <TestErrorButton />
      </div>
    </div>
  );
}
