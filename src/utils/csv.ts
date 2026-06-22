import type { PokemonDetails } from '../types/types';

export const csvEscape = (
  value: string | number | null | undefined
): string => {
  const text = value == null ? '' : String(value);

  if (/["\n,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const pokemonToCsvRow = (pokemon: PokemonDetails, origin: string): string => {
  const types = pokemon.types?.join(';') ?? '';

  const stats = pokemon.stats ?? {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0,
  };

  const detailsURL = `${origin}/?page=1&details=${pokemon.id}`;

  return [
    pokemon.id,
    pokemon.name,
    pokemon.height,
    pokemon.weight,
    types,
    stats.hp,
    stats.attack,
    stats.defense,
    stats.special_attack,
    stats.special_defense,
    stats.speed,
    detailsURL,
  ]
    .map(csvEscape)
    .join(',');
};

export const createCsvContent = (
  items: PokemonDetails[],
  origin: string
): string => {
  const headers = [
    'id',
    'name',
    'height',
    'weight',
    'types',
    'hp',
    'attack',
    'defense',
    'special_attack',
    'special_defense',
    'speed',
    'detailsURL',
  ];

  const rows = items.map((pokemon) => pokemonToCsvRow(pokemon, origin));

  return [headers.join(','), ...rows].join('\n');
};
