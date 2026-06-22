// src/app/api/export-csv/route.ts

import { NextRequest } from 'next/server';

import { GRAPHQL_ENDPOINT } from '../../../constants/constants';
import {
  GET_POKEMON_DETAILS,
  transformPokemonDetails,
} from '../../../store/pokemonApi';

import { createCsvContent } from '../../../utils/csv';

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    const graphqlResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_POKEMON_DETAILS,
        variables: { ids },
      }),
    });

    if (!graphqlResponse.ok) {
      return new Response('Failed to fetch Pokémon data', {
        status: 500,
      });
    }

    const json = await graphqlResponse.json();

    if (json.errors) {
      console.error(json.errors);

      return new Response('GraphQL query failed', {
        status: 500,
      });
    }

    const pokemon = json.data.pokemon.map(transformPokemonDetails);

    const csv = createCsvContent(pokemon, request.nextUrl.origin);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${ids.length}-selected-pokemon.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);

    return new Response('Failed to generate CSV', {
      status: 500,
    });
  }
}
