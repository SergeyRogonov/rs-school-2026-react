import React from 'react';

class Card extends React.Component {
  render() {
    return (
      <div className="flex flex-row w-3xs rounded-md border-2 border-black p-2">
        <div className="flex flex-col w-full gap-1">
          <div className="flex max-w-sm gap-2">
            <p>Pikachu</p>
            <p>#25</p>
          </div>
          <div className="flex gap-2">
            <p>Weight: 60</p>
            <p>Height: 4</p>
          </div>
          <div className="avatar flex justify-center items-center">
            <img className="block w-36" alt="Pikachu sprite" />
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
