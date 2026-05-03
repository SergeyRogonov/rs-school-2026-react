import React from 'react';
import Card from './Card';

class CardList extends React.Component {
  render() {
    return (
      <div className="flex flex-wrap gap-5 w-4/5 justify-center">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    );
  }
}

export default CardList;
