'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';

import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import Pagination from './Pagination';
import Detail from './Detail';
import SelectionFlyout from './SelectionFlyout';
import TestErrorButton from './TestErrorButton';

import {
  useGetPokemonListQuery,
  useSearchPokemonQuery,
  pokemonApi,
} from '../store/pokemonApi';

import { ITEMS_PER_PAGE, TOTAL_POKEMON_COUNT } from '../constants/constants';

import type { PokemonBase } from '../types/types';

type Props = {
  initialData: PokemonBase[];
  initialPage: number;
  initialSearch: string;
  initialDetailId: string | null;
};

export default function SearchResultsClient({
  initialData,
  initialPage,
  initialSearch,
  initialDetailId,
}: Props) {
  const t = useTranslations('homePage');

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const detailPanelRef = useRef<HTMLDivElement>(null);

  const currentPage = Number(searchParams.get('page')) || initialPage;

  const searchQuery = searchParams.get('search') ?? initialSearch;

  const detailId = searchParams.get('details') ?? initialDetailId;

  const totalPages = Math.ceil(TOTAL_POKEMON_COUNT / ITEMS_PER_PAGE);

  const {
    data: pokemonList,
    error: listError,
    isFetching: isLoadingList,
  } = useGetPokemonListQuery({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  const {
    data: searchedPokemon,
    error: searchError,
    isFetching: isLoadingSearch,
  } = useSearchPokemonQuery(
    searchQuery.trim() ? searchQuery.toLowerCase() : skipToken
  );

  const isSearching = Boolean(searchQuery);

  const isLoading = isSearching ? isLoadingSearch : isLoadingList;

  const error = isSearching ? searchError : listError;

  const data = isSearching
    ? searchedPokemon
      ? [searchedPokemon]
      : initialSearch
        ? initialData
        : []
    : (pokemonList ?? initialData);

  const isNotFound = isSearching && !isLoading && !error && !searchedPokemon;

  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', currentPage < 1 ? '1' : totalPages.toString());

      router.replace(`?${params.toString()}`);
    }
  }, [currentPage, totalPages, searchParams, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailId &&
        detailPanelRef.current &&
        !detailPanelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-detail-trigger]') &&
        !(event.target as HTMLElement).closest('[data-pagination]')
      ) {
        const params = new URLSearchParams(searchParams.toString());

        params.delete('details');

        router.replace(`?${params.toString()}`);
      }
    };

    if (detailId) {
      document.addEventListener('mousedown', handleClickOutside);

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [detailId, searchParams, router]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }

    params.delete('details');
    params.set('page', '1');

    router.replace(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    params.set('page', String(newPage));

    if (detailId) {
      params.set('details', detailId);
    }

    router.replace(`?${params.toString()}`);
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
          <Search key={searchQuery} onSearch={handleSearch} />

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
                      {t('errorLoading')}
                    </div>
                  )}

                  {!isLoading && !error && isNotFound && (
                    <div className="text-gray-500 font-semibold">
                      {t('pokemonNotFound')}
                      {' "'}
                      {searchQuery}
                      {'"'}
                    </div>
                  )}

                  {!isLoading && !error && data.length > 0 && (
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

      {!searchQuery && data.length > 0 ? (
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
