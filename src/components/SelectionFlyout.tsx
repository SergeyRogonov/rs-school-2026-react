import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelected } from '../store/selectionSlice';
import { pokemonApi } from '../store/pokemonApi';
import type { PokemonDetails } from '../types/types';
import { downloadCsv } from '../utils/donwloadCSVHelpers';

export default function SelectionFlyout() {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector((state) => state.selection.selectedIds);
  const selectedCount = selectedIds.length;

  const [fetchPokemonDetails] = pokemonApi.useLazyGetPokemonDetailsQuery();

  const handleUnselectAll = () => {
    dispatch(setSelected([]));
  };

  const handleDownload = async () => {
    if (!selectedIds.length) return;

    const pokemonData: PokemonDetails[] =
      await fetchPokemonDetails(selectedIds).unwrap();

    if (!pokemonData) return;

    const selectedPokemon = pokemonData.filter(
      (pokemon: PokemonDetails | null): pokemon is PokemonDetails =>
        pokemon !== null
    );

    downloadCsv(selectedPokemon, `${selectedCount}-selected-pokemon.csv`);
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
          className="rounded bg-(--bg-secondary) px-3 py-1 text-sm font-medium text-(--text-primary) transition hover:bg-(--bg-secondary-hover)"
        >
          Unselect all
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="rounded bg-(--brand-header) px-3 py-1 text-sm font-medium text-(--bg-secondary) transition hover:bg-(--brand-header-hover)"
        >
          Download
        </button>
      </div>
    </div>
  );
}
