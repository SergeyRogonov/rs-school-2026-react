import type { Pokemon } from '../types/types.ts';

const GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

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

const GET_POKEMON_BY_ID = `
  query GetPokemonById($id: Int) {
    pokemon: pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
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
  query GetPokemonDetails($id: Int) {
    pokemon: pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
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

const graphqlRequest = async (
  query: string,
  variables: Record<string, unknown> = {}
): Promise<GraphQLResponse> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
};

const transformRawPokemon = (rawPokemon: RawPokemonResponse): Pokemon => ({
  id: rawPokemon.id,
  name: rawPokemon.name,
  height: rawPokemon.height,
  weight: rawPokemon.weight,
  sprites: {
    front_default: rawPokemon.sprites?.[0]?.sprites?.front_default || null,
  },
  stats: rawPokemon.stats
    ? {
        hp: rawPokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
        attack:
          rawPokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat ||
          0,
        defense:
          rawPokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat ||
          0,
        special_attack:
          rawPokemon.stats.find((s) => s.stat.name === 'special-attack')
            ?.base_stat || 0,
        special_defense:
          rawPokemon.stats.find((s) => s.stat.name === 'special-defense')
            ?.base_stat || 0,
        speed:
          rawPokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
      }
    : undefined,
  types: rawPokemon.types?.map((t) => t.type.name) || [],
});

export const fetchPokemonList = async (
  limit: number = 20,
  page: number = 1
): Promise<Pokemon[]> => {
  const offset = (page - 1) * limit;
  const data = await graphqlRequest(GET_POKEMON_LIST, {
    limit,
    offset,
  });

  return data.pokemon.map(transformRawPokemon);
};

export const fetchPokemonDetails = async (
  id: number
): Promise<Pokemon | null> => {
  const data = await graphqlRequest(GET_POKEMON_DETAILS, { id });
  const rawPokemon = data.pokemon[0];
  if (!rawPokemon) return null;

  return transformRawPokemon(rawPokemon);
};

export const searchPokemon = async (query: string) => {
  const trimmedQuery = query.trim();

  const id = parseInt(trimmedQuery, 10);
  const isIdSearch = !isNaN(id) && id > 0;

  let data: GraphQLResponse;

  if (isIdSearch) {
    data = await graphqlRequest(GET_POKEMON_BY_ID, { id });
  } else {
    data = await graphqlRequest(GET_POKEMON_BY_NAME, {
      name: trimmedQuery.toLowerCase(),
    });
  }

  const rawPokemon = data.pokemon[0];
  if (!rawPokemon) return null;

  return transformRawPokemon(rawPokemon);
};

export const fetchPokemon = async (query?: string) => {
  if (query) {
    return await searchPokemon(query);
  } else {
    return await fetchPokemonList();
  }
};
