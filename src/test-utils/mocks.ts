// Mock fetch
export const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock localStorage
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock data
export const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
};

export const mockPokemonList = {
  results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
};

// Helper function to mock successful Pokemon list fetch
export const mockSuccessfulListFetch = () => {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonList),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    });
};
