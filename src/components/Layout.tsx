import { useEffect, useRef } from 'react';
import { useSearchParams, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import Pagination from './Pagination.tsx';
import TestErrorButton from './TestErrorButton.tsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadPokemon } from '../store/pokemonSlice';
import { ITEMS_PER_PAGE, TOTAL_POKEMON_COUNT } from '../constants/pokemon.ts';

export default function Layout() {
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [lastSearchTerm] = useLocalStorage('lastSearchTerm');
  const dispatch = useAppDispatch();

  const {
    items: pokemon,
    loading,
    error,
    lastQuery,
    currentPage,
  } = useAppSelector((state) => state.pokemon);

  const searchQuery = searchParams.get('search') || '';
  const totalPages = Math.ceil(TOTAL_POKEMON_COUNT / ITEMS_PER_PAGE);
  const detailId = searchParams.get('details');
  const isAboutPage = location.pathname === '/about';

  useEffect(() => {
    if (isAboutPage) return;

    const timer = setTimeout(() => {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const queryToLoad = searchQuery || lastSearchTerm;

      // Only fetch if the query/page is different from what's already loaded
      if (
        pokemon.length > 0 &&
        lastQuery === queryToLoad &&
        currentPage === page
      ) {
        return;
      }

      dispatch(loadPokemon({ query: queryToLoad, page }));

      if (!searchQuery && !searchParams.has('page')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '1');
        setSearchParams(newParams, { replace: true });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    isAboutPage,
    lastSearchTerm,
    searchQuery,
    currentPage,
    pokemon.length,
    lastQuery,
    searchParams,
    setSearchParams,
  ]);
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    const newParams = new URLSearchParams();
    if (trimmedQuery) {
      newParams.set('search', trimmedQuery);
    }
    newParams.delete('details');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set('search', searchQuery);
    }
    newParams.set('page', newPage.toString());
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
          {!isAboutPage && <Search key={searchQuery} onSearch={handleSearch} />}

          <div className="flex flex-1 overflow-hidden">
            <div
              className={`${
                detailId && !isAboutPage ? 'w-full md:w-2/3' : 'w-full'
              } overflow-auto`}
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
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {detailId && !isAboutPage && (
              <div
                ref={detailPanelRef}
                className="w-full md:w-1/3 border-l border-gray-300"
              >
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isAboutPage && !searchQuery && pokemon.length > 0 && (
        <div className="sticky bottom-0 z-10 bg-[#d45d79] py-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <div className="fixed bottom-0.5 right-0.5 sm:bottom-2 sm:right-6 lg:bottom-2 lg:right-20 z-10">
        <TestErrorButton />
      </div>
    </div>
  );
}
