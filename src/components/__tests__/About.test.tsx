import { screen } from '@testing-library/react';
import About from '../About';
import { renderWithProviders } from '../../test-utils/mocks';

describe('About', () => {
  it('renders about page title', () => {
    renderWithProviders(<About />);

    expect(screen.getByText('About the App')).toBeInTheDocument();
  });

  it('renders app description', () => {
    renderWithProviders(<About />);

    expect(screen.getByText('About the App')).toBeInTheDocument();
    expect(
      screen.getByText(/search for Pokémon by name or ID/)
    ).toBeInTheDocument();
  });
});
