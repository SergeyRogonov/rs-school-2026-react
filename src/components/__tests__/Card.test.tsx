import { screen } from '@testing-library/react';
import Card from '../Card';
import { mockPokemon, renderWithRouter } from '../../test-utils/mocks';

describe('Card', () => {
  it('renders pokemon name and id', () => {
    renderWithRouter(<Card pokemon={mockPokemon} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders pokemon weight and height', () => {
    renderWithRouter(<Card pokemon={mockPokemon} />);

    expect(screen.getByText('Weight: 69')).toBeInTheDocument();
    expect(screen.getByText('Height: 7')).toBeInTheDocument();
  });

  it('renders pokemon image with correct src', () => {
    renderWithRouter(<Card pokemon={mockPokemon} />);

    const image = screen.getByRole('img', { name: 'bulbasaur' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
  });
});
