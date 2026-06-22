import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT, ITEMS_PER_PAGE } from '../constants/constants';
import type { PokemonBase, PokemonDetails } from '../types/types';

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

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

const GET_POKEMON_DETAILS = `
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

function transformPokemonBase(rawPokemon: RawPokemonResponse): PokemonBase {
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

function transformPokemonDetails(
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

export async function getPokemonList(
  page: number,
  limit = ITEMS_PER_PAGE
): Promise<PokemonBase[]> {
  const response = await client.request<GraphQLResponse>(GET_POKEMON_LIST, {
    limit,
    offset: (page - 1) * limit,
  });

  return response.pokemon.map(transformPokemonBase);
}

export async function searchPokemon(name: string): Promise<PokemonBase | null> {
  const response = await client.request<GraphQLResponse>(GET_POKEMON_BY_NAME, {
    name: name.toLowerCase(),
  });

  const pokemon = response.pokemon[0];

  return pokemon ? transformPokemonBase(pokemon) : null;
}

export async function getPokemonDetails(
  ids: number[]
): Promise<PokemonDetails[]> {
  const response = await client.request<GraphQLResponse>(GET_POKEMON_DETAILS, {
    ids,
  });

  return response.pokemon.map(transformPokemonDetails);
}
