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
      ok: true,
      json: () =>
        Promise.resolve({
          data: { pokemon: [] },
        }),
    });

    render(<Layout />);

    await waitFor(() => {
      expect(
        screen.getByText('Pokémon "nonexistent" not found')
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

  it('uses last search term from localStorage on mount', async () => {
    mockLocalStorage.getItem.mockReturnValue('bulbasaur');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { pokemon: [mockPokemon] },
        }),
    });

    render(<Layout />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://beta.pokeapi.co/graphql/v1beta',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringMatching(/GetPokemonByName|GetPokemonById/),
        })
      );
    });
  });

  it('does not fetch if query is same as last query', async () => {
    mockLocalStorage.getItem.mockReturnValue('bulbasaur');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { pokemon: [mockPokemon] },
        }),
    });

    render(<Layout />);

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading...')).not.toBeInTheDocument();
    });

    mockFetch.mockClear();

    const input = screen.getByPlaceholderText('Search by name or ID');
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    fireEvent.submit(input.closest('form')!);

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

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'https://beta.pokeapi.co/graphql/v1beta',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('GetPokemonList'),
      })
    );
  });
});
