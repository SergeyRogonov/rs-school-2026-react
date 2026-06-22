import type { PokemonDetails } from '../types/types.ts';

const csvEscape = (value: string | number | null | undefined): string => {
  const text = value == null ? '' : String(value);
  if (/["\n,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const getPokemonUrl = (pokemon: PokemonDetails): string => {
  return `${window.location.origin}/?page=1&details=${pokemon.id}`;
};

const pokemonToCsvRow = (pokemon: PokemonDetails): string => {
  const types = pokemon.types?.join(';') ?? '';
  const stats = pokemon.stats ?? {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0,
  };

  const detailsURL = getPokemonUrl(pokemon);

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

const createCsvContent = (items: PokemonDetails[]): string => {
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
  const rows = items.map(pokemonToCsvRow);
  return [headers.join(','), ...rows].join('\n');
};

export const downloadCsv = (items: PokemonDetails[], filename: string) => {
  const csv = createCsvContent(items);

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
