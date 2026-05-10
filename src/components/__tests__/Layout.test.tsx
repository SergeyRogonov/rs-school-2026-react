import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Layout from '../Layout';
import {
  mockFetch,
  mockLocalStorage,
  mockPokemon,
  mockSuccessfulListFetch,
} from '../../test-utils/mocks';

describe('Layout', () => {
  it('renders header and search components', () => {
    mockSuccessfulListFetch();

    render(<Layout />);

    expect(screen.getByText('Pokémon Search App')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by name or ID')
    ).toBeInTheDocument();
  });

  it('shows spinner while loading', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Layout />);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays pokemon list on mount', async () => {
    mockSuccessfulListFetch();

    render(<Layout />);

    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('displays error when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<Layout />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    });
  });

  it('displays 404 error for non-existent pokemon', async () => {
    mockLocalStorage.getItem.mockReturnValue('nonexistent');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<Layout />);

    await waitFor(() => {
      expect(
        screen.getByText('Pokémon with name or id "nonexistent" does not exist')
      ).toBeInTheDocument();
    });
  });

  it('displays error when fetch response is not ok (non-404)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Layout />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    });
  });

  it('uses last search term from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValue('pikachu');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    });

    render(<Layout />);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );
  });

  it('does not fetch if query is same as last query', () => {
    mockLocalStorage.getItem.mockReturnValue('pikachu');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    });

    render(<Layout />);

    // Reset mock to track new calls
    mockFetch.mockClear();

    // Search for same pokemon again
    const input = screen.getByPlaceholderText('Search by name or ID');
    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.submit(input.closest('form')!);

    // Should not make new fetch calls
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fetches default pokemon list when localStorage is empty', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockSuccessfulListFetch();

    render(<Layout />);

    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Verify it fetched the default list, not a specific pokemon
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
    );
  });
});
