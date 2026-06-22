import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import type { PokemonBase, PokemonDetails } from '../types/types.ts';
import {
  ITEMS_PER_PAGE,
  RTK_QUERY_CACHE_TTL,
  GRAPHQL_ENDPOINT,
} from '../constants/constants';

interface RawSpriteData {
  sprites: {
    front_default?: string;
  };
}

interface RawStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface RawType {
  type: {
    name: string;
  };
}

interface RawPokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: RawSpriteData[];
  stats: RawStat[];
  types: RawType[];
}

interface GraphQLResponse {
  pokemon: RawPokemonResponse[];
}

const GET_POKEMON_LIST = `
  query GetPokemonList($limit: Int, $offset: Int) {
    pokemon: pokemon_v2_pokemon(limit: $limit, offset: $offset) {
      id
      name
      height
      weight
      sprites: pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

const GET_POKEMON_BY_NAME = `
  query GetPokemonByName($name: String) {
    pokemon: pokemon_v2_pokemon(where: {name: {_eq: $name}}) {
      id
      name
      height
      weight
      sprites: pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = `
  query GetPokemonDetails($ids: [Int!]!) {
    pokemon: pokemon_v2_pokemon(where: {id: {_in: $ids}}) {
      id
      name
      height
      weight
      sprites: pokemon_v2_pokemonsprites {
        sprites
      }
      stats: pokemon_v2_pokemonstats {
        base_stat
        stat: pokemon_v2_stat {
          name
        }
      }
      types: pokemon_v2_pokemontypes {
        type: pokemon_v2_type {
          name
        }
      }
    }
  }
`;

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: graphqlRequestBaseQuery({
    url: GRAPHQL_ENDPOINT,
  }),
  tagTypes: ['PokemonList', 'PokemonDetails', 'PokemonSearch'],
  keepUnusedDataFor: RTK_QUERY_CACHE_TTL,

  endpoints: (build) => ({
    getPokemonList: build.query<PokemonBase[], { limit: number; page: number }>(
      {
        query: (args = { limit: ITEMS_PER_PAGE, page: 1 }) => ({
          document: GET_POKEMON_LIST,
          variables: {
            limit: args.limit,
            offset: (args.page - 1) * args.limit,
          },
        }),
        transformResponse: (response: GraphQLResponse) =>
          response.pokemon.map(transformPokemonBase),
        providesTags: (_result, _error, arg) => [
          { type: 'PokemonList', id: arg?.page ?? 1 },
        ],
      }
    ),

    getPokemonDetails: build.query<PokemonDetails[], number | number[]>({
      query: (ids) => ({
        document: GET_POKEMON_DETAILS,
        variables: { ids: Array.isArray(ids) ? ids : [ids] },
      }),
      transformResponse: (response: GraphQLResponse) =>
        response.pokemon.map(transformPokemonDetails),
      providesTags: (result) =>
        result
          ? result.map((pokemon) => ({
              type: 'PokemonDetails' as const,
              id: pokemon.id,
            }))
          : [],
    }),

    searchPokemon: build.query<PokemonBase | null, string>({
      query: (query) => ({
        document: GET_POKEMON_BY_NAME,
        variables: { name: query },
      }),
      transformResponse: (response: GraphQLResponse) => {
        const rawPokemon = response.pokemon[0];
        return rawPokemon ? transformPokemonBase(rawPokemon) : null;
      },
      providesTags: (_result, _error, name) => [
        { type: 'PokemonSearch', id: name },
      ],
    }),
  }),
});

export function transformPokemonBase(
  rawPokemon: RawPokemonResponse
): PokemonBase {
  return {
    id: rawPokemon.id,
    name: rawPokemon.name,
    height: rawPokemon.height,
    weight: rawPokemon.weight,
    sprites: {
      front_default: rawPokemon.sprites?.[0]?.sprites?.front_default ?? null,
    },
  };
}

export function transformPokemonDetails(
  rawPokemon: RawPokemonResponse
): PokemonDetails {
  return {
    ...transformPokemonBase(rawPokemon),

    types: rawPokemon.types.map((t) => t.type.name),

    stats: {
      hp: rawPokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat ?? 0,

      attack:
        rawPokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat ?? 0,

      defense:
        rawPokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat ?? 0,

      special_attack:
        rawPokemon.stats.find((s) => s.stat.name === 'special-attack')
          ?.base_stat ?? 0,

      special_defense:
        rawPokemon.stats.find((s) => s.stat.name === 'special-defense')
          ?.base_stat ?? 0,

      speed:
        rawPokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat ?? 0,
    },
  };
}

export const {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonQuery,
} = pokemonApi;
