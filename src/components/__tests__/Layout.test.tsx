import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';
import {
  mockFetch,
  mockLocalStorage,
  mockPokemon,
  mockSuccessfulListFetch,
} from '../../test-utils/mocks';

const renderWithRouter = (
  component: React.ReactNode,
  initialEntries = ['/']
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
  );
};

describe('Layout', () => {
  it('renders header and search components', () => {
    mockSuccessfulListFetch();

    renderWithRouter(<Layout />);

    expect(screen.getByText('Pokémon Search App')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by name or ID')
    ).toBeInTheDocument();
  });

  it('shows spinner while loading', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithRouter(<Layout />);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays pokemon list on mount', async () => {
    mockSuccessfulListFetch();

    renderWithRouter(<Layout />);

    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('displays error when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch data'));

    renderWithRouter(<Layout />);

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

    renderWithRouter(<Layout />);

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

    renderWithRouter(<Layout />);

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

    renderWithRouter(<Layout />);

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

    renderWithRouter(<Layout />);

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

    renderWithRouter(<Layout />);

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

  describe('Layout Pagination', () => {
    it('shows pagination when not searching and first page pokemons are loaded', async () => {
      mockSuccessfulListFetch();

      renderWithRouter(<Layout />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('hides pagination when searching', async () => {
      mockLocalStorage.getItem.mockReturnValue('bulbasaur');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { pokemon: [mockPokemon] },
          }),
      });

      renderWithRouter(<Layout />, ['/?search=bulbasaur']);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('loads correct page from URL on mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { pokemon: [{ ...mockPokemon, id: 21, name: 'spearow' }] },
          }),
      });

      renderWithRouter(<Layout />, ['/?page=2']);

      await waitFor(() => {
        // Verify API was called with page=2
        expect(mockFetch).toHaveBeenCalledWith(
          'https://beta.pokeapi.co/graphql/v1beta',
          expect.objectContaining({
            body: expect.stringContaining('"offset":20'),
          })
        );
      });
    });
  });
});
