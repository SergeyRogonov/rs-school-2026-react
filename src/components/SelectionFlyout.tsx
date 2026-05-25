import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelected } from '../store/selectionSlice';
import { fetchPokemonDetails } from '../services/pokemonService';
import type { Pokemon } from '../types/types';

const csvEscape = (value: string | number | null | undefined): string => {
  const text = value == null ? '' : String(value);
  if (/["\n,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const pokemonToCsvRow = (pokemon: Pokemon): string => {
  const types = pokemon.types?.join(';') ?? '';
  const stats = pokemon.stats ?? {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0,
  };

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
  ]
    .map(csvEscape)
    .join(',');
};

const createCsvContent = (items: Pokemon[]): string => {
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
  ];
  const rows = items.map(pokemonToCsvRow);
  return [headers.join(','), ...rows].join('\n');
};

export default function SelectionFlyout() {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.selection.selectedIds);
  const selectedCount = selectedIds.length;

  const handleUnselectAll = () => {
    dispatch(setSelected([]));
  };

  const handleDownload = async () => {
    const pokemonData = await Promise.all(
      selectedIds.map((id) => fetchPokemonDetails(id))
    );

    const selectedPokemon = pokemonData.filter(
      (pokemon): pokemon is Pokemon => pokemon !== null
    );

    const csv = createCsvContent(selectedPokemon);

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedCount}-selected-pokemon.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 flex-row justify-between">
      <div className="flex-col">
        <span className="text-sm font-semibold text-black">
          Selected items: {selectedCount}
        </span>
      </div>

      <div className="flex gap-2 flex-row">
        <button
          type="button"
          onClick={handleUnselectAll}
          className="rounded bg-(--bg-secondary) px-3 py-1 text-sm font-medium text-(--text-primary) transition hover:bg-(--border-color)"
        >
          Unselect all
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="rounded bg-(--brand-header) px-3 py-1 text-sm font-medium text-(--bg-secondary) transition hover:bg-(--border-color)"
        >
          Download
        </button>
      </div>
    </div>
  );
}
