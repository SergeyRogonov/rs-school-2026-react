import type { Pokemon } from '../types/types.ts';

const GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

interface RawSpriteData {
  sprites: {
    front_default?: string;
  };
}

interface RawPokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: RawSpriteData[];
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
});

export const fetchPokemonList = async (
  limit: number = 20,
  offset: number = 0
): Promise<Pokemon[]> => {
  const data = await graphqlRequest(GET_POKEMON_LIST, {
    limit,
    offset,
  });

  return data.pokemon.map(transformRawPokemon);
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
