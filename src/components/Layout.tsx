import React from 'react';
import Header from './Header';
import Search from './Search';
import CardList from './CardList';
import Spinner from './Spinner';
import type { Pokemon } from '../types/types.ts';
import TestErrorButton from './TestErrorButton.tsx';

interface LayoutState {
  pokemon: Pokemon[];
  loading: boolean;
  lastQuery: string | null;
  error: string | null;
}

class Layout extends React.Component<Record<string, never>, LayoutState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      pokemon: [],
      loading: true,
      lastQuery: null,
      error: null,
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

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404 && isSinglePokemon) {
          throw new Error(`Pokémon with name or id "${query}" does not exist`);
        }
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (isSinglePokemon) {
        this.setState({ pokemon: [data], loading: false, error: null });
      } else {
        const pokemonDetails = await Promise.all(
          data.results.map((p: { url: string }) =>
            fetch(p.url).then((r) => r.json())
          )
        );
        this.setState({ pokemon: pokemonDetails, loading: false, error: null });
      }
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
        pokemon: [],
      });
    }
  };

  handleSearch = (query: string) => {
    this.fetchPokemon(query);
  };

  render() {
    const { pokemon, loading, error } = this.state;

    return (
      <div className="flex flex-col min-h-screen p-5">
        <div className="sticky top-0 flex flex-col gap-5 bg-[#d6fff2] z-20 p-10">
          <Header />
          <Search onSearch={this.handleSearch} />
        </div>
        <div className="flex overflow-auto justify-center">
          {error && (
            <div className="text-red-600 text-center">
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {loading && !error && <Spinner />}
          {!loading && !error && <CardList pokemon={pokemon} />}
        </div>
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-20 z-10">
          <TestErrorButton />
        </div>
      </div>
    );
  }
}

export default Layout;
