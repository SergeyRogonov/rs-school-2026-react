import { screen, waitFor, fireEvent } from '@testing-library/react';
import { type Mock } from 'vitest';
import { useSearchParams, useRouter } from 'next/navigation';
import HomePage from '../HomePage';
import { TOTAL_POKEMON_COUNT, ITEMS_PER_PAGE } from '../../constants/constants';
import { mockPokemonBase, renderWithProviders } from '../../test-utils/mocks';
import { mockLocalStorage } from '../../test-utils/setup';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock the entire pokemonApi module using importOriginal
vi.mock('../../store/pokemonApi', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../store/pokemonApi')>();
  const mockUseGetPokemonListQuery = vi.fn();
  const mockUseSearchPokemonQuery = vi.fn();

  return {
    ...actual,
    useGetPokemonListQuery: mockUseGetPokemonListQuery,
    useSearchPokemonQuery: mockUseSearchPokemonQuery,
  };
});

// Import the mocked module
import {
  useGetPokemonListQuery,
  useSearchPokemonQuery,
} from '../../store/pokemonApi';

describe('HomePage', () => {
  let mockReplace: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReplace = vi.fn();

    (useRouter as Mock).mockReturnValue({
      replace: mockReplace,
    });

    (useSearchParams as Mock).mockReturnValue(new URLSearchParams());

    mockLocalStorage.getItem.mockReturnValue(null);

    (useSearchPokemonQuery as Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isFetching: false,
    });
  });

  it('renders search input and results when data is loaded', () => {
    (useGetPokemonListQuery as Mock).mockReturnValue({
      data: [mockPokemonBase],
      error: null,
      isFetching: false,
    });

    renderWithProviders(<HomePage />);

    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('shows spinner while loading', () => {
    (useGetPokemonListQuery as Mock).mockReturnValue({
      data: undefined,
      error: null,
      isFetching: true,
    });

    renderWithProviders(<HomePage />);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays pokemon list on mount', async () => {
    (useGetPokemonListQuery as Mock).mockReturnValue({
      data: [mockPokemonBase],
      error: null,
      isFetching: false,
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('displays error when fetch fails', async () => {
    (useGetPokemonListQuery as Mock).mockReturnValue({
      data: undefined,
      error: { message: 'Failed to fetch data' },
      isFetching: false,
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Error loading Pokémon.')).toBeInTheDocument();
    });
  });

  it('displays "No Pokémon found" for non-existent search', async () => {
    (useSearchPokemonQuery as Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
    });

    (useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('search=nonexistent')
    );

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText('No Pokémon found for "nonexistent"')
      ).toBeInTheDocument();
    });
  });

  it('uses last search term from localStorage on mount', async () => {
    mockLocalStorage.getItem.mockReturnValue('bulbasaur');
    (useSearchPokemonQuery as Mock).mockReturnValue({
      data: mockPokemonBase,
      error: null,
      isFetching: false,
    });

    (useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('search=bulbasaur')
    );

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('fetches default pokemon list when localStorage is empty', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    (useGetPokemonListQuery as Mock).mockReturnValue({
      data: [mockPokemonBase],
      error: null,
      isFetching: false,
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  describe('Layout Pagination', () => {
    it('shows pagination when not searching and pokemons are loaded', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('hides pagination when searching', async () => {
      mockLocalStorage.getItem.mockReturnValue('bulbasaur');
      (useSearchPokemonQuery as Mock).mockReturnValue({
        data: mockPokemonBase,
        error: null,
        isFetching: false,
      });

      (useSearchParams as Mock).mockReturnValue(
        new URLSearchParams('search=bulbasaur')
      );

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
  });

  it('adjusts layout classes when detailId is present', async () => {
    (useGetPokemonListQuery as Mock).mockReturnValue({
      data: [mockPokemonBase],
      error: null,
      isFetching: false,
    });

    vi.mock('../Detail', () => ({
      default: () => <div data-testid="mock-detail">Mock Detail</div>,
    }));

    (useSearchParams as Mock).mockReturnValue(new URLSearchParams('details=1'));

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      // Check that the main content area has the correct class for reduced width
      const mainContent = document.querySelector('[class*="w-full md:w-2/3"]');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('SelectionFlyout positioning', () => {
    it('positions SelectionFlyout above pagination when not searching', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      // Check for the class that positions flyout above pagination
      const flyoutAbovePagination = document.querySelector(
        '.fixed.left-0.right-0.bottom-11'
      );
      expect(flyoutAbovePagination).toBeInTheDocument();
    });

    it('positions SelectionFlyout at bottom when searching', async () => {
      mockLocalStorage.getItem.mockReturnValue('bulbasaur');
      (useSearchPokemonQuery as Mock).mockReturnValue({
        data: mockPokemonBase,
        error: null,
        isFetching: false,
      });

      (useSearchParams as Mock).mockReturnValue(
        new URLSearchParams('search=bulbasaur')
      );

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });

      // Check for the class that positions flyout at bottom
      const flyoutAtBottom = document.querySelector(
        '.fixed.left-0.right-0.bottom-0'
      );
      expect(flyoutAtBottom).toBeInTheDocument();
    });
  });

  describe('Pagination and URL updates', () => {
    it('updates page parameter when Next button is clicked', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      (useSearchParams as Mock).mockReturnValue(new URLSearchParams('page=1'));

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('?page=2');
      });
    });

    it('updates page parameter when Previous button is clicked from page 2', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      (useSearchParams as Mock).mockReturnValue(new URLSearchParams('page=2'));

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('?page=1');
      });
    });

    it('preserves detailId when changing pages', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      // Mock the Detail component
      vi.mock('../Detail', () => ({
        default: () => <div data-testid="mock-detail">Mock Detail</div>,
      }));

      (useSearchParams as Mock).mockReturnValue(
        new URLSearchParams('details=1&page=1')
      );

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          expect.stringContaining('details=1')
        );
        expect(mockReplace).toHaveBeenCalledWith(
          expect.stringContaining('page=2')
        );
      });
    });

    it('disables Previous button on first page', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      (useSearchParams as Mock).mockReturnValue(new URLSearchParams('page=1'));

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', async () => {
      (useGetPokemonListQuery as Mock).mockReturnValue({
        data: [mockPokemonBase],
        error: null,
        isFetching: false,
      });

      const totalPages = Math.ceil(TOTAL_POKEMON_COUNT / ITEMS_PER_PAGE);

      (useSearchParams as Mock).mockReturnValue(
        new URLSearchParams(`page=${totalPages}`)
      );

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });
  });
});
