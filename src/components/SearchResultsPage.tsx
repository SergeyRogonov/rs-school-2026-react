import { ITEMS_PER_PAGE } from '../constants/constants';
import { getPokemonList, searchPokemon } from '../lib/pokemon';
import type { PokemonBase } from '../types/types';
import SearchResultsClient from './SearchResultsClient';

interface Props {
  page: number;
  search: string;
  details?: string;
}

export default async function SearchResultsPage({
  page,
  search,
  details,
}: Props) {
  let data: PokemonBase[];

  if (search) {
    const pokemon = await searchPokemon(search);
    data = pokemon ? [pokemon] : [];
  } else {
    data = await getPokemonList(page, ITEMS_PER_PAGE);
  }

  return (
    <SearchResultsClient
      initialData={data}
      initialPage={page}
      initialSearch={search}
      initialDetailId={details ?? null}
    />
  );
}
