import { screen, fireEvent, waitFor } from '@testing-library/react';
import Card from '../Card';
import {
  renderWithRouter,
  mockPokemon,
  mockLocalStorage,
} from '../../test-utils/mocks';
import { useLocation } from 'react-router-dom';

function LocationDisplay() {
  const loc = useLocation();
  return <div data-testid="location">{loc.search}</div>;
}

describe('Card', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('toggles selection when checkbox is clicked and does not change search params', async () => {
    renderWithRouter(
      <>
        <Card pokemon={mockPokemon} />
        <LocationDisplay />
      </>,
      ['/']
    );

    const checkbox = screen.getByLabelText(
      'Select bulbasaur'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox.checked).toBe(true);
      expect(screen.getByTestId('location').textContent).toBe('');
    });
  });

  it('sets details search param when card (not checkbox) is clicked', async () => {
    renderWithRouter(
      <>
        <Card pokemon={mockPokemon} />
        <LocationDisplay />
      </>,
      ['/']
    );

    // click the card container (by triggering on the pokemon name)
    fireEvent.click(screen.getByText('bulbasaur'));

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toMatch(/details=1/);
    });
  });

  it('renders checked when localStorage has the id selected', () => {
    renderWithRouter(<Card pokemon={mockPokemon} />, ['/'], {
      selection: { selectedIds: [1] },
    });

    const checkbox = screen.getByLabelText(
      'Select bulbasaur'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
