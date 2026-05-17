import Card from './Card';
import type { Pokemon } from '../types/types.ts';

interface CardListProps {
  pokemon: Pokemon[];
}

export default function CardList({ pokemon }: CardListProps) {
  return (
    <div className="flex flex-wrap max-w-7xl gap-5 w-4/5">
      <div className="flex w-full justify-center">
        <h2 className="text-3xl font-semibold">Results</h2>
      </div>
      <div className="flex flex-wrap w-full gap-5 justify-center">
        {pokemon.map((p) => (
          <Card key={p.id} pokemon={p} />
        ))}
      </div>
    </div>
  );
}
