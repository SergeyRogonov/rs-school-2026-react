import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../Search';
import { mockLocalStorage } from '../../test-utils/mocks';

describe('Search', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<Search onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', () => {
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  it('handles empty search with only whitespace', () => {
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('trims whitespace from search query', () => {
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search by name');

    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  it('saves search term to localStorage', () => {
    render(<Search onSearch={mockOnSearch} />);

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

    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      'Search by name'
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('loads last search term from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValue('bulbasaur');

    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByDisplayValue('bulbasaur');
    expect(input).toBeInTheDocument();
  });

  it('does not save to localStorage if search term unchanged', () => {
    mockLocalStorage.getItem.mockReturnValue('pikachu');

    render(<Search onSearch={mockOnSearch} />);

    const button = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(button);

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });
});
