export const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

export const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
  },
};

export const mockSuccessfulListFetch = () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          pokemon: [mockPokemon],
        },
      }),
  });
};
