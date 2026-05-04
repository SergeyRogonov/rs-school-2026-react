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
        {this.props.pokemon.map((p) => (
          <Card key={p.id} pokemon={p} />
        ))}
      </div>
    );
  }
}

export default CardList;
