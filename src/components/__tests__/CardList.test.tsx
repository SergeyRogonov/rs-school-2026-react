import { screen } from '@testing-library/react';
import CardList from '../CardList';
import { mockPokemon, renderWithRouter } from '../../test-utils/mocks';

describe('CardList', () => {
  const multiplePokemon = [
    mockPokemon,
    { ...mockPokemon, id: 2, name: 'ivysaur' },
    { ...mockPokemon, id: 3, name: 'venusaur' },
  ];

  it('renders empty list when no pokemon provided', () => {
    renderWithRouter(<CardList pokemon={[]} />);

    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('renders single pokemon card', () => {
    renderWithRouter(<CardList pokemon={[mockPokemon]} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders multiple pokemon cards', () => {
    renderWithRouter(<CardList pokemon={multiplePokemon} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('venusaur')).toBeInTheDocument();
  });

  it('renders correct number of pokemon cards', () => {
    renderWithRouter(<CardList pokemon={multiplePokemon} />);

    const pokemonCards = screen.getAllByText(/Weight:/);
    expect(pokemonCards).toHaveLength(3);
  });
});
