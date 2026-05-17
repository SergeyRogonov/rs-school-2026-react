import type { Pokemon } from '../types/types.ts';

interface CardProps {
  pokemon: Pokemon;
}

export default function Card({ pokemon }: CardProps) {
  return (
    <div className="flex flex-row w-3xs rounded-md border-2 border-black p-2">
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
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
        </div>
      </div>
    </div>
  );
}
