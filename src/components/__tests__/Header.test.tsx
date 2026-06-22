import { screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../Header';
import { renderWithProviders } from '../../test-utils/mocks';
import { mockLocalStorage } from '../../test-utils/setup';

const mockReplace = vi.fn();

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

  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'theme') return 'light';
      if (key === 'lastSearchTerm') return 'some-search-term';
      return null;
    });
  });

  it('renders links, toggles theme, and Home clears lastSearchTerm + navigates', async () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Pokémon Search App')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    expect(toggle).toHaveTextContent('🌙');

    fireEvent.click(toggle);

    await waitFor(() => expect(toggle).toHaveTextContent('☀️'));

    const home = screen.getByText('Home');

    fireEvent.click(home);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lastSearchTerm',
        ''
      );

      expect(mockReplace).toHaveBeenCalled();
    });
  });
});
