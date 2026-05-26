import { screen, fireEvent, waitFor } from '@testing-library/react';
import SelectionFlyout from '../SelectionFlyout';
import { renderWithRouter } from '../../test-utils/mocks';
import { fetchPokemonDetails } from '../../services/pokemonService';
import { mockPokemon } from '../../test-utils/mocks';
import { vi } from 'vitest';

vi.mock('../../services/pokemonService', () => ({
  fetchPokemonDetails: vi.fn(),
}));

describe('SelectionFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when there are no selected items', () => {
    renderWithRouter(<SelectionFlyout />);

    expect(screen.queryByText(/Selected items/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /unselect all/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /download/i })
    ).not.toBeInTheDocument();
  });

  it('renders selected count and buttons when items are selected', () => {
    renderWithRouter(<SelectionFlyout />, ['/'], {
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
    renderWithRouter(<SelectionFlyout />, ['/'], {
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

    vi.mocked(fetchPokemonDetails).mockResolvedValue(mockPokemon);

    renderWithRouter(<SelectionFlyout />, ['/'], {
      selection: { selectedIds: [1] },
    });

    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(fetchPokemonDetails).toHaveBeenCalledWith(1);
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
