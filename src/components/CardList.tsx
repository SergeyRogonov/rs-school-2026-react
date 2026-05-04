import React from 'react';
import Card from './Card';
import type { Pokemon } from '../types/types.ts';

interface CardListProps {
  pokemon: Pokemon[];
}

class CardList extends React.Component<CardListProps> {
  render() {
    return (
      <div className="flex flex-wrap gap-5 w-4/5 justify-center">
        <div className="flex w-4/5">
          <h2 className="text-3xl font-semibold">Results</h2>
        </div>
        {this.props.pokemon.map((p) => (
          <Card key={p.id} pokemon={p} />
        ))}
      </div>
    );
  }
}

export default CardList;
