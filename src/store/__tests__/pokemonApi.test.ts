import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  pokemonApi,
  transformPokemonBase,
  transformPokemonDetails,
} from '../pokemonApi';
import {
  mockPokemonBaseResponse,
  mockPokemonDetailsResponse,
  mockPokemonBase,
  mockPokemonDetails,
} from '../../test-utils/mocks';
import { RTK_QUERY_CACHE_TTL } from '../../constants/constants';

type FetchMock = ReturnType<typeof vi.fn>;

const createApiStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

describe('pokemonApi transformation helpers', () => {
  describe('transformPokemonBase', () => {
    it('converts raw GraphQL pokemon data to PokemonBase', () => {
      const properMock = {
        ...mockPokemonBaseResponse,
        stats: [],
        types: [],
      };

      const result = transformPokemonBase(properMock);

      expect(result).toEqual(mockPokemonBase);
    });

    it('returns null for front_default when sprite data is missing', () => {
      const rawPokemon = {
        ...mockPokemonBaseResponse,
        sprites: [],
        stats: [],
        types: [],
      };

      const result = transformPokemonBase(rawPokemon);

      expect(result.sprites.front_default).toBeNull();
    });

    it('returns null for front_default when the sprite object contains null', () => {
      const rawPokemon = {
        ...mockPokemonBaseResponse,
        sprites: [
          {
            sprites: {
              front_default: undefined,
            },
          },
        ],
        stats: [],
        types: [],
      };

      const result = transformPokemonBase(rawPokemon);

      expect(result.sprites.front_default).toBeNull();
    });
  });

  describe('transformPokemonDetails', () => {
    it('converts raw GraphQL pokemon data to PokemonDetails', () => {
      const result = transformPokemonDetails(mockPokemonDetailsResponse);

      expect(result).toEqual(mockPokemonDetails);
    });

    it('defaults missing stats to zero values', () => {
      const rawPokemon = {
        ...mockPokemonDetailsResponse,
        stats: [],
      };

      const result = transformPokemonDetails(rawPokemon);

      expect(result.stats).toEqual({
        hp: 0,
        attack: 0,
        defense: 0,
        special_attack: 0,
        special_defense: 0,
        speed: 0,
      });
    });

    it('defaults missing types to an empty array', () => {
      const rawPokemon = {
        ...mockPokemonDetailsResponse,
        types: [],
      };

      const result = transformPokemonDetails(rawPokemon);

      expect(result.types).toEqual([]);
    });

    it('handles partial stats by preserving provided values and defaulting missing ones', () => {
      const rawPokemon = {
        ...mockPokemonDetailsResponse,
        stats: [
          { base_stat: 45, stat: { name: 'hp' } },
          { base_stat: 49, stat: { name: 'attack' } },
        ],
      };

      const result = transformPokemonDetails(rawPokemon);

      expect(result.stats).toEqual({
        hp: 45,
        attack: 49,
        defense: 0,
        special_attack: 0,
        special_defense: 0,
        speed: 0,
      });
    });
  });
});

describe('pokemonApi endpoints', () => {
  let store: ReturnType<typeof createApiStore>;
  let fetchMock: FetchMock;

  beforeEach(() => {
    store = createApiStore();

    const createGraphQLResponse = (data: unknown) => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ data }),
      text: async () => JSON.stringify({ data }),
    });

    fetchMock = vi.fn(async () =>
      createGraphQLResponse({ pokemon: [mockPokemonBaseResponse] })
    ) as unknown as FetchMock;

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds the pokemon list query and returns transformed base results', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ limit: 1, page: 2 })
    );

    expect(result.data).toEqual([mockPokemonBase]);

    const [, fetchOptions] = fetchMock.mock.calls[0];
    const body = JSON.parse(fetchOptions?.body as string);

    expect(body.query).toContain(
      'pokemon_v2_pokemon(limit: $limit, offset: $offset)'
    );
    expect(body.variables).toEqual({ limit: 1, offset: 1 });
  });

  it('builds the pokemon details query and returns transformed details', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        data: {
          pokemon: [mockPokemonDetailsResponse],
        },
      }),
      text: async () =>
        JSON.stringify({
          data: {
            pokemon: [mockPokemonDetailsResponse],
          },
        }),
    });

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate([1, 2])
    );

    expect(result.data).toEqual([mockPokemonDetails]);

    const [, fetchOptions] = fetchMock.mock.calls[0];
    const body = JSON.parse(fetchOptions?.body as string);

    expect(body.query).toContain(
      'pokemon_v2_pokemon(where: {id: {_in: $ids}})'
    );
    expect(body.variables).toEqual({ ids: [1, 2] });
  });

  it('builds the search query and returns null when no result is found', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        data: {
          pokemon: [],
        },
      }),
      text: async () => JSON.stringify({ data: { pokemon: [] } }),
    });

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemon.initiate('missing-pokemon')
    );

    expect(result.data).toBeNull();

    const [, fetchOptions] = fetchMock.mock.calls[0];
    const body = JSON.parse(fetchOptions?.body as string);

    expect(body.query).toContain(
      'pokemon_v2_pokemon(where: {name: {_eq: $name}})'
    );
    expect(body.variables).toEqual({ name: 'missing-pokemon' });
  });

  it('reuses cached pokemon list results when the same query is requested again', async () => {
    const firstRequest = store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ limit: 1, page: 1 })
    );

    const firstResult = await firstRequest;
    expect(firstResult.data).toEqual([mockPokemonBase]);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    firstRequest.unsubscribe?.();

    const secondResult = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ limit: 1, page: 1 })
    );

    expect(secondResult.data).toEqual([mockPokemonBase]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('evicts cached pokemon list results after the cache TTL expires', async () => {
    vi.useFakeTimers();

    try {
      const firstRequest = store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({ limit: 1, page: 1 })
      );

      const firstResult = await firstRequest;
      expect(firstResult.data).toEqual([mockPokemonBase]);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      firstRequest.unsubscribe?.();
      fetchMock.mockClear();

      vi.advanceTimersByTime((RTK_QUERY_CACHE_TTL + 1) * 1000);
      await vi.runAllTimersAsync();

      const secondResult = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({ limit: 1, page: 1 })
      );

      expect(secondResult.data).toEqual([mockPokemonBase]);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
