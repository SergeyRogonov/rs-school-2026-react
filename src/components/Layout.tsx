import React from 'react';
import Header from './Header';
import Search from './Search/Search';
import CardList from './CardList';

class Layout extends React.Component {
  render() {
    return (
      <div className="flex flex-col h-screen gap-10">
        <div className="flex flex-col gap-5 h-1/5">
          <Header />
          <Search />
        </div>

        <div className="flex overflow-auto justify-center">
          <CardList />
        </div>
      </div>
    );
  }
}

export default Layout;
