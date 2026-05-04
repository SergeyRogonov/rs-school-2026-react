import React from 'react';
import Header from './Header';
import Search from './Search';
import CardList from './CardList';
import type { Pokemon } from '../types/types.ts';

interface LayoutState {
  pokemon: Pokemon[];
  loading: boolean;
  lastQuery: string | null;
}

class Layout extends React.Component<object, LayoutState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      pokemon: [],
      loading: true,
      lastQuery: null,
    };
  }

  componentDidMount() {
    const lastSearch = localStorage.getItem('lastSearchTerm');
    if (lastSearch) {
      this.fetchPokemon(lastSearch);
    } else {
      this.fetchPokemon();
    }
  }

  fetchPokemon = async (query?: string) => {
    const queryToUse = query || '';

    if (queryToUse === this.state.lastQuery) {
      return;
    }

    this.setState({ loading: true, lastQuery: queryToUse });

    let url: string;
    let isSinglePokemon = false;

    if (query) {
      url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
      isSinglePokemon = true;
    } else {
      url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Not found');

    const data = await response.json();

    if (isSinglePokemon) {
      this.setState({ pokemon: [data], loading: false });
    } else {
      const pokemonDetails = await Promise.all(
        data.results.map((p: { url: string }) =>
          fetch(p.url).then((r) => r.json())
        )
      );
      this.setState({ pokemon: pokemonDetails, loading: false });
    }
  };

  handleSearch = (query: string) => {
    this.fetchPokemon(query);
  };

  render() {
    const { pokemon, loading } = this.state;

    return (
      <div className="flex flex-col h-screen gap-10 p-5">
        <div className="flex flex-col gap-5 h-1/5">
          <Header />
          <Search onSearch={this.handleSearch} />
        </div>

        <div className="flex overflow-auto justify-center">
          {loading ? <p>Loading...</p> : <CardList pokemon={pokemon} />}
        </div>
      </div>
    );
  }
}

export default Layout;
