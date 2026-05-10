import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders pokemon search app title', () => {
    render(<Header />);
    expect(screen.getByText('Pokémon Search App')).toBeInTheDocument();
  });
});
