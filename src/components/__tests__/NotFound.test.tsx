import { screen } from '@testing-library/react';
import NotFound from '../NotFound';
import { renderWithProviders } from '../../test-utils/mocks';

describe('NotFound', () => {
  it('renders 404 page title', () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  it('renders page not found message', () => {
    renderWithProviders(<NotFound />);

    expect(
      screen.getByText(/The page you are looking for does not exist/)
    ).toBeInTheDocument();
  });

  it('renders return to home link', () => {
    renderWithProviders(<NotFound />);

    const homeLink = screen.getByRole('link', { name: 'Return to Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
