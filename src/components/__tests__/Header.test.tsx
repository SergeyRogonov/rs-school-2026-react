import { screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../Header';
import { renderWithRouter, mockLocalStorage } from '../../test-utils/mocks';
import { useLocation } from 'react-router-dom';

function LocationDisplay() {
  const loc = useLocation();
  return <div data-testid="location">{loc.search}</div>;
}

describe('Header', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.removeItem.mockClear();
  });

  it('renders links, toggles theme, and Home clears lastSearchTerm + navigates', async () => {
    // Mock getItem to return different values for different keys
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'light';
      if (key === 'lastSearchTerm') return 'some-search-term';
      return null;
    });

    renderWithRouter(
      <>
        <Header />
        <LocationDisplay />
      </>,
      ['/']
    );

    expect(screen.getByText('Pokémon Search App')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggle).toHaveTextContent('🌙');
    fireEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveTextContent('☀️'));

    const home = screen.getByText('Home');
    fireEvent.click(home);
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lastSearchTerm',
        ''
      );

      expect(screen.getByTestId('location').textContent).toMatch(/page=1/);
    });
  });
});
