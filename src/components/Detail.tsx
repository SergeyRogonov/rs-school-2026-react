'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import Spinner from './Spinner';
import { useGetPokemonDetailsQuery } from '../store/pokemonApi';
import { typeColors } from '../utils/typeColors.ts';
import { pokemonApi } from '../store/pokemonApi';

export default function Detail() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const detailId = searchParams.get('details');
  const dispatch = useDispatch();

  const {
    data: pokemonArray,
    isLoading: loading,
    error: error,
  } = useGetPokemonDetailsQuery(detailId ? [Number(detailId)] : [], {});

  const pokemon = pokemonArray?.[0] ?? null;

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    router.replace(`?${newParams.toString()}`);
  };

  if (!detailId) return null;

  const handleInvalidateDetails = () => {
    dispatch(
      pokemonApi.util.invalidateTags([{ type: 'PokemonDetails', id: detailId }])
    );
  };

  return (
    <div className="w-full p-4 border-l border-(--border-color)">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('details.title')}</h2>
        <button
          onClick={handleInvalidateDetails}
          className="rounded bg-blue-500 px-2 py-1 text-[10px] font-medium text-white hover:bg-blue-600"
        >
          {t('details.invalidateButton')}
        </button>
        <button
          onClick={handleClose}
          className="px-3 py-1 rounded hover:bg-(--bg-primary-hover) font-bold"
        >
          X
        </button>
      </div>

      {loading && <Spinner />}

      {!loading && (error || !pokemon) && (
        <div className="text-(--brand-header)">
          <p className="font-semibold">{t('details.error.title')}</p>
          <p>{t('details.error.pokemonNotFound')}</p>
        </div>
      )}

      {!loading && pokemon && (
        <div className="space-y-4">
          {/* Name and ID */}
          <div className="flex flex-col w-full gap-1">
            <div className="flex max-w-sm gap-2">
              <p className="text-xl font-semibold capitalize">{pokemon.name}</p>
              <p className="text-xl">#{pokemon.id}</p>
            </div>
            <div className="flex gap-2">
              <p>
                {t('details.pokemon.weight')}: {pokemon.weight}
              </p>
              <p>
                {t('details.pokemon.height')}: {pokemon.height}
              </p>
            </div>
          </div>

          {/* Sprite */}
          <div className="text-center">
            <img
              className="mx-auto w-48 h-48"
              src={pokemon.sprites.front_default || ''}
              alt={pokemon.name}
            />
          </div>

          {/* Types */}
          {pokemon.types?.length > 0 && (
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    typeColors[type] || 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {t(`details.pokemonTypes.${type}`)}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          {pokemon.stats && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">
                {t('details.stats.title')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded">
                  <p className="font-medium text-red-700">
                    {t('details.stats.hp')}
                  </p>
                  <p className="text-lg font-bold">{pokemon.stats.hp}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-medium text-orange-700">
                    {t('details.stats.attack')}
                  </p>
                  <p className="text-lg font-bold">{pokemon.stats.attack}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-medium text-yellow-700">
                    {t('details.stats.defense')}
                  </p>
                  <p className="text-lg font-bold">{pokemon.stats.defense}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-700">
                    {t('details.stats.specialAttack')}
                  </p>
                  <p className="text-lg font-bold">
                    {pokemon.stats.special_attack}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-700">
                    {t('details.stats.specialDefense')}
                  </p>
                  <p className="text-lg font-bold">
                    {pokemon.stats.special_defense}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-medium text-purple-700">
                    {t('details.stats.speed')}
                  </p>
                  <p className="text-lg font-bold">{pokemon.stats.speed}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
