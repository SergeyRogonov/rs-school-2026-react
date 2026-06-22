'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { skipToken } from '@reduxjs/toolkit/query';
import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import Pagination from './Pagination.tsx';
import TestErrorButton from './TestErrorButton.tsx';
import Detail from './Detail.tsx';
import { useDispatch } from 'react-redux';
import { pokemonApi } from '../store/pokemonApi';
import SelectionFlyout from './SelectionFlyout';
import {
  useGetPokemonListQuery,
  useSearchPokemonQuery,
} from '../store/pokemonApi';
import { ITEMS_PER_PAGE, TOTAL_POKEMON_COUNT } from '../constants/constants.ts';

export default function HomePage() {
  const t = useTranslations();
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const totalPages = Math.ceil(TOTAL_POKEMON_COUNT / ITEMS_PER_PAGE);
  const detailId = searchParams.get('details');
  const dispatch = useDispatch();

  const {
    data: pokemons = [],
    error: listError,
    isFetching: isLoadingList,
  } = useGetPokemonListQuery({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  const {
    data: pokemon,
    error: searchError,
    isFetching: isLoadingSearch,
  } = useSearchPokemonQuery(
    searchQuery.trim().toLowerCase() ? searchQuery : skipToken
  );

  const isSearching = Boolean(searchQuery);
  const isLoading = isSearching ? isLoadingSearch : isLoadingList;
  const error = isSearching ? searchError : listError;
  const data = isSearching ? (pokemon ? [pokemon] : []) : pokemons;

  const isNotFound = isSearching && !isLoading && !error && !pokemon;

  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      const newParams = new URLSearchParams(searchParams.toString());

      newParams.set('page', currentPage < 1 ? '1' : totalPages.toString());

      router.replace(`?${newParams.toString()}`);
    }
  }, [currentPage, totalPages, searchParams, router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailId &&
        detailPanelRef.current &&
        !detailPanelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-detail-trigger]') &&
        !(e.target as HTMLElement).closest('[data-pagination]')
      ) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('details');
        router.replace(`?${newParams.toString()}`);
      }
    };
    if (detailId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [detailId, searchParams, router]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();

    const newParams = new URLSearchParams(searchParams.toString());
    if (trimmedQuery) {
      newParams.set('search', trimmedQuery);
    } else {
      newParams.delete('search');
    }

    newParams.delete('details');
    newParams.set('page', '1');
    router.replace(`?${newParams.toString()}`);
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
    router.replace(`?${newParams.toString()}`);
  };

  const handleInvalidateAllData = () => {
    dispatch(
      pokemonApi.util.invalidateTags([
        'PokemonList',
        'PokemonSearch',
        'PokemonDetails',
      ])
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end p-2 gap-2 bg-(--bg-primary) text-(--text-primary)">
        <button
          onClick={handleInvalidateAllData}
          className="rounded bg-blue-500 px-2 py-1 text-[10px] font-medium text-white hover:bg-blue-600"
        >
          {t('invalidateAllButton')}
        </button>
        <TestErrorButton />
      </div>

      <div className="flex flex-col flex-1 p-5 bg-(--bg-primary) text-(--text-primary)">
        <div className="flex flex-col gap-5">
          {<Search key={searchQuery} onSearch={handleSearch} />}

          <div className="flex flex-1 overflow-hidden">
            <div
              className={`${
                detailId ? 'w-full md:w-2/3' : 'w-full'
              } overflow-auto`}
            >
              <div className="flex justify-center">
                <div className="flex justify-center">
                  {isLoading && <Spinner />}
                  {!isLoading && Boolean(error) && (
                    <div className="text-red-500 font-bold">
                      Error loading Pokémon.
                    </div>
                  )}
                  {!isLoading && !error && isNotFound && (
                    <div className="text-gray-500 font-semibold">
                      No Pokémon found for &#34;{searchQuery}&#34;
                    </div>
                  )}
                  {!isLoading && !error && data?.length > 0 && (
                    <div className="flex flex-col items-center w-full">
                      <CardList pokemon={data} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {detailId && (
              <div
                ref={detailPanelRef}
                className="w-full md:w-1/3 border-l border-(--border-color)"
              >
                <Detail />
              </div>
            )}
          </div>
        </div>
      </div>

      {!searchQuery && data?.length > 0 ? (
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
