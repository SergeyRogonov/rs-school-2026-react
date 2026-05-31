import { screen, waitFor } from '@testing-library/react';
import { type Mock } from 'vitest';
import Detail from '../Detail';
import { mockPokemonDetails, renderWithRouter } from '../../test-utils/mocks';

// Mock the entire pokemonApi module using importOriginal as suggested
vi.mock('../../store/pokemonApi', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../store/pokemonApi')>();
  const mockUseGetPokemonDetailsQuery = vi.fn();

  return {
    ...actual,
    useGetPokemonDetailsQuery: mockUseGetPokemonDetailsQuery,
  };
});

// Import the mocked module
import { useGetPokemonDetailsQuery } from '../../store/pokemonApi';

describe('Detail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no detailId in URL', () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    const { container } = renderWithRouter(<Detail />, ['/']);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading spinner when fetching details', () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithRouter(<Detail />, ['/?details=1']);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('displays error when fetch fails', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Failed to fetch data' },
    });

    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('displays "Pokémon not found" error when no data returned', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithRouter(<Detail />, ['/?details=999']);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('displays pokemon image', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: [mockPokemonDetails],
      isLoading: false,
      error: null,
    });

    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      const image = screen.getByRole('img', { name: 'bulbasaur' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
    });
  });

  it('displays pokemon types when available', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: [mockPokemonDetails],
      isLoading: false,
      error: null,
    });

    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });
  });

  it('displays pokemon stats when available', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: [mockPokemonDetails],
      isLoading: false,
      error: null,
    });

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
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: [mockPokemonDetails],
      isLoading: false,
      error: null,
    });

    renderWithRouter(<Detail />, ['/?details=1']);

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'X' });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
