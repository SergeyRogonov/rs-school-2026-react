import { screen, render } from '@testing-library/react';
import About from '../About';

describe('About', () => {
  it('renders about page title', () => {
    render(<About />);

    expect(screen.getByText('About the App')).toBeInTheDocument();
  });

  it('renders app description', () => {
    render(<About />);

    expect(screen.getByText('About the App')).toBeInTheDocument();
    expect(
      screen.getByText(/search for Pokémon by name or ID/)
    ).toBeInTheDocument();
  });
});
