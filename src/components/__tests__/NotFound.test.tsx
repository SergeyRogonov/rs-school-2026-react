import { screen } from '@testing-library/react';
import NotFound from './not-found';
import { renderWithRouter } from '../test-utils/mocks';

describe('NotFound', () => {
  it('renders 404 page title', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  it('renders page not found message', () => {
    renderWithRouter(<NotFound />);

    expect(
      screen.getByText(/The page you are looking for does not exist/)
    ).toBeInTheDocument();
  });

  it('renders return to home link', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: 'Return to Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
