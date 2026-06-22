import { screen, fireEvent } from '@testing-library/react';
import TestErrorButton from '../TestErrorButton';
import { renderWithProviders } from '../../test-utils/mocks';

describe('TestErrorButton', () => {
  it('renders throw error button', () => {
    renderWithProviders(<TestErrorButton />);

    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('throws error when button is clicked', () => {
    expect(() => {
      const { rerender } = renderWithProviders(<TestErrorButton />);

      const button = screen.getByRole('button', { name: 'Throw Error' });
      fireEvent.click(button);

      rerender(<TestErrorButton />);
    }).toThrow('Test error triggered by user');
  });
});
