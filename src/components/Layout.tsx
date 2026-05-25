import { useEffect, useRef } from 'react';
import { useSearchParams, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import Pagination from './Pagination.tsx';
import TestErrorButton from './TestErrorButton.tsx';
import SelectionFlyout from './SelectionFlyout';
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

    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailId &&
        detailPanelRef.current &&
        !detailPanelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-detail-trigger]') &&
        !(e.target as HTMLElement).closest('[data-pagination]')
      ) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('details');
        setSearchParams(newParams);
      }
    };
    if (detailId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => clearTimeout(timer);
  }, [
    detailId,
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
      <div className="flex justify-end p-1">
        <TestErrorButton />
      </div>

      <div className="flex flex-col flex-1 p-5 bg-(--bg-primary) text-(--text-primary)">
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
                className="w-full md:w-1/3 border-l border-(--border-color)"
              >
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isAboutPage && !searchQuery && pokemon.length > 0 ? (
        <>
          <div className="sticky bottom-0 z-20 bg-(--brand-header) py-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="fixed left-0 right-0 bottom-11 z-10 border-t border-(--border-color) bg-gray-300 px-4 py-1 shadow-lg">
            <SelectionFlyout />
          </div>
        </>
      ) : (
        <div className="fixed left-0 right-0 bottom-0 z-10 border-t border-(--border-color) bg-gray-300 px-4 py-3 shadow-lg">
          <SelectionFlyout />
        </div>
      )}
    </div>
  );
}
