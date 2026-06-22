import { screen } from '@testing-library/react';
import NotFound from '../NotFound';
import { renderWithProviders } from '../../test-utils/mocks';

vi.mock('../../i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href?: string | { pathname?: string };
    }
  >) => (
    <a href={typeof href === 'string' ? href : '/'} {...props}>
      {children}
    </a>
  ),

  usePathname: () => '/',
}));

describe('NotFound', () => {
  it('renders 404 page title', () => {
    renderWithProviders(
      <NotFound
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        buttonText="Return to Home"
      />
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  it('renders page not found message', () => {
    renderWithProviders(
      <NotFound
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        buttonText="Return to Home"
      />
    );

    expect(
      screen.getByText(/The page you are looking for does not exist/)
    ).toBeInTheDocument();
  });

  it('renders return to home link', () => {
    renderWithProviders(
      <NotFound
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        buttonText="Return to Home"
      />
    );

    const homeLink = screen.getByRole('link', { name: 'Return to Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
