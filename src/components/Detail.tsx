import { useSearchParams } from 'react-router-dom';
import Spinner from './Spinner';
import { useGetPokemonDetailsQuery } from '../store/pokemonApi';
import { typeColors } from '../utils/typeColors.ts';

export default function Detail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailId = searchParams.get('details');

  const {
    data: pokemonArray,
    isLoading: loading,
    error: error,
  } = useGetPokemonDetailsQuery(detailId ? [Number(detailId)] : [], {});

  const pokemon = pokemonArray?.[0] ?? null;

  // Handle closing the detail panel
  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    setSearchParams(newParams);
  };

  if (!detailId) return null;

  return (
    <div className="w-full p-4 border-l border-(--border-color)">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Details</h2>
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
          <p className="font-semibold">Error</p>
          <p>Pokémon not found</p>
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
              <p>Weight: {pokemon.weight}</p>
              <p>Height: {pokemon.height}</p>
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
                  {type}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          {pokemon.stats && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Base Stats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded">
                  <p className="font-medium text-red-700">HP</p>
                  <p className="text-lg font-bold">{pokemon.stats.hp}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-medium text-orange-700">Attack</p>
                  <p className="text-lg font-bold">{pokemon.stats.attack}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-medium text-yellow-700">Defense</p>
                  <p className="text-lg font-bold">{pokemon.stats.defense}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-700">Sp. Attack</p>
                  <p className="text-lg font-bold">
                    {pokemon.stats.special_attack}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-700">Sp. Defense</p>
                  <p className="text-lg font-bold">
                    {pokemon.stats.special_defense}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-medium text-purple-700">Speed</p>
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
