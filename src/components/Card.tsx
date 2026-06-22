import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSelected } from '../store/selectionSlice';
import type { ChangeEvent } from 'react';
import type { PokemonBase } from '../types/types.ts';

interface CardProps {
  pokemon: PokemonBase;
}

export default function Card({ pokemon }: CardProps) {
  const t = useTranslations('card');
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isSelected = useAppSelector((state) =>
    state.selection.selectedIds.includes(pokemon.id)
  );

  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('details', pokemon.id.toString());
    router.replace(`?${newParams.toString()}`);
  };

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleSelected(pokemon.id));
  };

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
            <p>
              {t('weight')}: {pokemon.weight}
            </p>
            <p>
              {t('height')}: {pokemon.height}
            </p>
          </div>
          <div className="avatar flex justify-center items-center">
            {pokemon.sprites.front_default && (
              <Image
                src={pokemon.sprites.front_default || ''}
                alt={pokemon.name}
                width={144}
                height={144}
                className="block"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
