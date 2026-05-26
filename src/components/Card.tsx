import type { Pokemon } from '../types/types.ts';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSelected } from '../store/selectionSlice';
import type { ChangeEvent } from 'react';

interface CardProps {
  pokemon: Pokemon;
}

export default function Card({ pokemon }: CardProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const isSelected = useAppSelector((state) =>
    state.selection.selectedIds.includes(pokemon.id)
  );

  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('details', pokemon.id.toString());
    setSearchParams(newParams);
  };

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent open-details when clicking checkbox
    dispatch(toggleSelected(pokemon.id));
  };

  // Prevent checkbox clicks from bubbling when using onClick on input
  const onCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex flex-row w-3xs rounded-md border-2 border-(--border-color)  p-2"
      onClick={handleClick}
      data-detail-trigger
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onCheckboxChange}
          onClick={onCheckboxClick}
          aria-label={`Select ${pokemon.name}`}
          className="h-6 w-6 accent-(--brand-header) focus:ring-2 focus:ring-(--border-color) rounded"
        />
        <div className="flex flex-col w-full gap-1">
          <div className="flex max-w-sm gap-2">
            <p className="capitalize">{pokemon.name}</p>
            <p>#{pokemon.id}</p>
          </div>
          <div className="flex gap-2">
            <p>Weight: {pokemon.weight}</p>
            <p>Height: {pokemon.height}</p>
          </div>
          <div className="avatar flex justify-center items-center">
            <img
              className="block w-36"
              src={pokemon.sprites.front_default || ''}
              alt={pokemon.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
