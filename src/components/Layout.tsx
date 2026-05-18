import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import Pagination from './Pagination.tsx';
import type { Pokemon } from '../types/types.ts';
import TestErrorButton from './TestErrorButton.tsx';
import { fetchPokemon, fetchPokemonList } from '../services/pokemonService';

const ITEMS_PER_PAGE = 20;
const TOTAL_POKEMON_COUNT = 1025;

export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const totalPages = Math.ceil(TOTAL_POKEMON_COUNT / ITEMS_PER_PAGE);
  const detailId = searchParams.get('details');
  const isAboutPage = location.pathname === '/about';

  const loadPokemon = useCallback(
    async (query?: string, page: number = 1) => {
      const queryToUse = query || '';
      const pageToUse = page;

      if (queryToUse === lastQuery && pageToUse === lastPage) {
        return;
      }

      setLoading(true);
      setLastQuery(queryToUse);
      setLastPage(pageToUse);

      try {
        let data;
        if (queryToUse) {
          data = await fetchPokemon(queryToUse);
          if (data && !Array.isArray(data)) {
            setPokemon([data]);
          } else {
            setPokemon([]);
            throw new Error(`Pokémon "${query}" not found`);
          }
        } else {
          data = await fetchPokemonList(ITEMS_PER_PAGE, pageToUse);
          setPokemon(data);
        }

        setLoading(false);
        setError(null);
      } catch (err) {
        setPokemon([]);
        setLoading(false);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
    [lastQuery, lastPage]
  );

  useEffect(() => {
    // Don't load pokemon if we're on the about page
    if (isAboutPage) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 0);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const lastSearch = localStorage.getItem('lastSearchTerm') || '';

      loadPokemon(lastSearch, page);
    }, 0);

    return () => clearTimeout(timer);
  }, [loadPokemon, searchParams, isAboutPage]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    const newParams = new URLSearchParams();
    if (trimmedQuery) {
      newParams.set('search', trimmedQuery);
    }
    // Remove details when searching
    newParams.delete('details');
    // Page is automatically removed when search is set (page=1 is default)
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set('search', searchQuery);
    }
    if (newPage > 1) {
      newParams.set('page', newPage.toString());
    }
    // Keep details parameter if it exists
    if (detailId) {
      newParams.set('details', detailId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-20">
        <Header />
      </div>

      <div className="flex flex-col flex-1 p-5 bg-[#d6fff2]">
        <div className="flex flex-col gap-5">
          {!isAboutPage && <Search onSearch={handleSearch} />}

          <div className="flex flex-1 overflow-hidden">
            {/* Main content area */}
            <div
              className={`${detailId && !isAboutPage ? 'w-full md:w-2/3' : 'w-full'} overflow-auto`}
            >
              <div className="flex justify-center">
                {isAboutPage ? (
                  <Outlet />
                ) : (
                  <>
                    {error && (
                      <div className="text-red-600 text-center">
                        <p className="text-lg font-semibold">Error</p>
                        <p>{error}</p>
                      </div>
                    )}
                    {loading && !error && <Spinner />}
                    {!loading && !error && (
                      <div className="flex flex-col items-center w-full">
                        <CardList pokemon={pokemon} />
                        {!searchQuery && pokemon.length > 0 && (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right side - Detail panel */}
            {detailId && !isAboutPage && (
              <div className="w-full md:w-1/3 border-l border-gray-300">
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-20 z-10">
        <TestErrorButton />
      </div>
    </div>
  );
}
