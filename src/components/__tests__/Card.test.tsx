import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Mock } from 'vitest';
import Card from '../Card';
import { renderWithProviders, mockPokemonBase } from '../../test-utils/mocks';
import { mockLocalStorage } from '../../test-utils/setup';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

describe('Card', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(null);

    (useSearchParams as Mock).mockReturnValue(new URLSearchParams());

    (useRouter as Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('toggles selection when checkbox is clicked and does not change search params', async () => {
    renderWithProviders(<Card pokemon={mockPokemonBase} />);

    const checkbox = screen.getByLabelText(
      'Select bulbasaur'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox.checked).toBe(true);
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('sets details search param when card (not checkbox) is clicked', async () => {
    renderWithProviders(<Card pokemon={mockPokemonBase} />);

    // click the card container (by triggering on the pokemon name)
    fireEvent.click(screen.getByText('bulbasaur'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('?details=1');
    });
  });

  it('renders checked when localStorage has the id selected', () => {
    renderWithProviders(<Card pokemon={mockPokemonBase} />, {
      selection: { selectedIds: [1] },
    });

    const checkbox = screen.getByLabelText(
      'Select bulbasaur'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
