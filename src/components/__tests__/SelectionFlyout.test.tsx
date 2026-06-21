import { screen, fireEvent, waitFor } from '@testing-library/react';
import SelectionFlyout from '../SelectionFlyout';
import {
  mockPokemonDetails,
  renderWithProviders,
} from '../../test-utils/mocks';
import { type Mock } from 'vitest';

// Mock the entire pokemonApi module with the mock function defined inside
vi.mock('../../store/pokemonApi', () => {
  const mockUseLazyGetPokemonDetailsQuery = vi.fn();

  return {
    pokemonApi: {
      useLazyGetPokemonDetailsQuery: mockUseLazyGetPokemonDetailsQuery,
    },
  };
});

// Now we need to get the mock function from the mocked module
import { pokemonApi } from '../../store/pokemonApi';

describe('SelectionFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when there are no selected items', () => {
    // Mock the hook to return a function and state
    (pokemonApi.useLazyGetPokemonDetailsQuery as Mock).mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ]);

    renderWithProviders(<SelectionFlyout />);

    expect(screen.queryByText(/Selected items/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /unselect all/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /download/i })
    ).not.toBeInTheDocument();
  });

  it('renders selected count and buttons when items are selected', () => {
    // Mock the hook to return a function and state
    (pokemonApi.useLazyGetPokemonDetailsQuery as Mock).mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ]);

    renderWithProviders(<SelectionFlyout />, {
      selection: { selectedIds: [1, 2] },
    });

    expect(screen.getByText('Selected items: 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  it('clears selection when Unselect all is clicked', async () => {
    // Mock the hook to return a function and state
    (pokemonApi.useLazyGetPokemonDetailsQuery as Mock).mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ]);

    renderWithProviders(<SelectionFlyout />, {
      selection: { selectedIds: [1, 2] },
    });

    fireEvent.click(screen.getByRole('button', { name: /unselect all/i }));

    await waitFor(() => {
      expect(screen.queryByText('Selected items: 2')).not.toBeInTheDocument();
    });
  });

  it('downloads CSV for selected pokemon', async () => {
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    // Create a mock promise with unwrap() method
    const mockPromise = {
      unwrap: vi.fn().mockResolvedValue([mockPokemonDetails]),
    };

    const mockFetchPokemonDetails = vi.fn().mockReturnValue(mockPromise);

    // Mock the hook to return our mock function and state
    (pokemonApi.useLazyGetPokemonDetailsQuery as Mock).mockReturnValue([
      mockFetchPokemonDetails,
      { isLoading: false },
    ]);

    renderWithProviders(<SelectionFlyout />, {
      selection: { selectedIds: [1] },
    });

    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(mockFetchPokemonDetails).toHaveBeenCalledWith([1]);
      expect(mockPromise.unwrap).toHaveBeenCalled();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
