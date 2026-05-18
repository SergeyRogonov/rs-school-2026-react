import { screen } from '@testing-library/react';
import Header from '../Header';
import { renderWithRouter } from '../../test-utils/mocks';

describe('Header', () => {
  it('renders pokemon search app title', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Pokémon Search App')).toBeInTheDocument();
  });
});
