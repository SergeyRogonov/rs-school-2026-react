import { screen, waitFor } from '@testing-library/react';
import Detail from '../Detail';
import {
  mockFetch,
  mockPokemon,
  renderWithRouter,
} from '../../test-utils/mocks';

describe('Detail', () => {
  const mockPokemonWithDetails = {
    ...mockPokemon,
    sprites: [
      {
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
        },
      },
    ],
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
      { base_stat: 49, stat: { name: 'defense' } },
      { base_stat: 65, stat: { name: 'special-attack' } },
      { base_stat: 65, stat: { name: 'special-defense' } },
      { base_stat: 45, stat: { name: 'speed' } },
    ],
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  };

  const mockSuccessfulDetailFetch = (pokemon = mockPokemonWithDetails) => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            pokemon: [pokemon],
          },
        }),
    });
  };

  it('renders nothing when no detailId in URL', () => {
    const { container } = renderWithRouter(<Detail />, ['/']);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading spinner when fetching details', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithRouter(<Detail />, ['/?details=1']);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('displays error when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch data'));
    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    });
  });

  it('displays "Pokémon not found" error when no data returned', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { pokemon: [] },
        }),
    });
    renderWithRouter(<Detail />, ['/?details=999']);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('displays pokemon image', async () => {
    mockSuccessfulDetailFetch();
    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      const image = screen.getByRole('img', { name: 'bulbasaur' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
    });
  });

  it('displays pokemon types when available', async () => {
    mockSuccessfulDetailFetch();
    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });
  });

  it('displays pokemon stats when available', async () => {
    mockSuccessfulDetailFetch();
    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText('Base Stats')).toBeInTheDocument();

      const hpStat = screen.getByText('HP').closest('div');
      expect(hpStat).toHaveTextContent('45');

      const attackStat = screen.getByText('Attack').closest('div');
      expect(attackStat).toHaveTextContent('49');

      const defenseStat = screen.getByText('Defense').closest('div');
      expect(defenseStat).toHaveTextContent('49');

      const spAttackStat = screen.getByText('Sp. Attack').closest('div');
      expect(spAttackStat).toHaveTextContent('65');

      const spDefenseStat = screen.getByText('Sp. Defense').closest('div');
      expect(spDefenseStat).toHaveTextContent('65');

      const speedStat = screen.getByText('Speed').closest('div');
      expect(speedStat).toHaveTextContent('45');
    });
  });

  it('renders close button', async () => {
    mockSuccessfulDetailFetch();
    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'X' });
      expect(closeButton).toBeInTheDocument();
    });
  });

  it('handles invalid ID (0 or negative)', async () => {
    mockSuccessfulDetailFetch();
    renderWithRouter(<Detail />, ['/?details=0']);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'https://beta.pokeapi.co/graphql/v1beta',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringMatching(/GetPokemonByName/),
        })
      );
    });
  });
});
