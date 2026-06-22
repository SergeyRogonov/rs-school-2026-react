import { screen, fireEvent } from '@testing-library/react';
import Search from '../Search';
import { mockLocalStorage } from '../../test-utils/setup';
import { renderWithProviders } from '../../test-utils/mocks';

describe('Search', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    renderWithProviders(<Search onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', () => {
    renderWithProviders(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  it('handles empty search with only whitespace', () => {
    renderWithProviders(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('trims whitespace from search query', () => {
    renderWithProviders(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');

    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  it('saves search term to localStorage', () => {
    renderWithProviders(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');

    fireEvent.change(input, { target: { value: 'charizard' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'lastSearchTerm',
      'charizard'
    );
  });

  it('renders with empty input when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    renderWithProviders(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      'Search by name'
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('loads last search term from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValue('bulbasaur');

    renderWithProviders(<Search onSearch={mockOnSearch} />);

    const input = screen.getByDisplayValue('bulbasaur');
    expect(input).toBeInTheDocument();
  });
});
