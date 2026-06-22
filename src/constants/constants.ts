export const ITEMS_PER_PAGE = 20;
export const TOTAL_POKEMON_COUNT = 1025;
export const GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

const DEFAULT_RTK_QUERY_CACHE_TTL = 60;
const parsedCacheTtl = Number(process.env.NEXT_PUBLIC_RTK_QUERY_CACHE_TTL);

export const RTK_QUERY_CACHE_TTL =
  Number.isFinite(parsedCacheTtl) && parsedCacheTtl >= 0
    ? parsedCacheTtl
    : DEFAULT_RTK_QUERY_CACHE_TTL;
