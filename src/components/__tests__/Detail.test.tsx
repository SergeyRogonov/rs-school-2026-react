import { screen, waitFor, fireEvent } from '@testing-library/react';
import { type Mock } from 'vitest';
import { useSearchParams, useRouter } from 'next/navigation';
import Detail from '../Detail';
import {
  mockPokemonDetails,
  renderWithProviders,
} from '../../test-utils/mocks';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock the entire pokemonApi module
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
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as Mock).mockReturnValue({
      replace: mockReplace,
    });

    (useSearchParams as Mock).mockReturnValue(new URLSearchParams('details=1'));
  });

  it('renders nothing when no detailId in URL', () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    (useSearchParams as Mock).mockReturnValue(new URLSearchParams());

    const { container } = renderWithProviders(<Detail />);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading spinner when fetching details', () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<Detail />);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('displays error when fetch fails', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Failed to fetch data' },
    });

    renderWithProviders(<Detail />);

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

    (useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('details=999')
    );

    renderWithProviders(<Detail />);

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

    renderWithProviders(<Detail />);

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

    renderWithProviders(<Detail />);

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

    renderWithProviders(<Detail />);

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

    renderWithProviders(<Detail />);

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'X' });
      expect(closeButton).toBeInTheDocument();
    });
  });

  it('removes details query param when close button is clicked', async () => {
    (useGetPokemonDetailsQuery as Mock).mockReturnValue({
      data: [mockPokemonDetails],
      isLoading: false,
      error: null,
    });

    const mockReplace = vi.fn();

    (useRouter as Mock).mockReturnValue({
      replace: mockReplace,
    });

    renderWithProviders(<Detail />);

    const closeButton = screen.getByRole('button', { name: 'X' });

    fireEvent.click(closeButton);

    expect(mockReplace).toHaveBeenCalled();
  });
});
