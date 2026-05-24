import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from './Spinner';
import { searchPokemon, fetchPokemonDetails } from '../services/pokemonService';
import type { Pokemon } from '../types/types.ts';
import { typeColors } from '../utils/typeColors.ts';

export default function Detail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detailId = searchParams.get('details');

  useEffect(() => {
    if (!detailId) {
      // Use setTimeout to avoid synchronous state updates
      const timer = setTimeout(() => {
        setPokemon(null);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to parse as ID first for more efficient query
        const id = parseInt(detailId, 10);
        let data;

        if (!isNaN(id) && id > 0) {
          data = await fetchPokemonDetails(id);
        } else {
          data = await searchPokemon(detailId);
        }

        if (data) {
          setPokemon(data);
        } else {
          setError('Pokémon not found');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [detailId]);

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    setSearchParams(newParams);
  };

  if (!detailId) {
    return null;
  }

  return (
    <div className="w-full p-4 border-l border-gray-300">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="flex text-2xl font-bold">Details</h2>
        <button
          onClick={handleClose}
          className="px-3 py-1 rounded hover:bg-[#57d4ac] font-bold flex"
        >
          X
        </button>
      </div>

      {loading && <Spinner />}

      {error && (
        <div className="text-red-600">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && pokemon && (
        <div className="space-y-4">
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

          <div className="text-center">
            <img
              className="mx-auto w-48 h-48"
              src={pokemon.sprites.front_default || ''}
              alt={pokemon.name}
            />
          </div>

          {/* Types */}
          {pokemon.types && pokemon.types.length > 0 && (
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${typeColors[type] || 'bg-gray-200 text-gray-800'}`}
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
